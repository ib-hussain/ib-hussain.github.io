#!/usr/bin/env python3
"""Create a Markdown tree of pages discoverable on a public website."""

from __future__ import annotations

import argparse
from collections import deque
from dataclasses import dataclass, field
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import time
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import quote, unquote, urldefrag, urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET
from urllib.robotparser import RobotFileParser


USER_AGENT = "PortfolioPageTreeBot/1.0 (+https://ib-hussain.github.io/)"
HTML_CONTENT_TYPES = {"text/html", "application/xhtml+xml"}
TEXT_CONTENT_TYPES = {
    "application/javascript",
    "application/json",
    "application/ld+json",
    "application/xml",
    "text/css",
    "text/javascript",
    "text/plain",
    "text/xml",
}
ABSOLUTE_URL = re.compile(r"https?://[^\s\"'<>\\]+")
MAX_TEXT_BYTES = 2_000_000


@dataclass
class Page:
    url: str
    status: int | None
    content_type: str
    title: str = ""
    error: str = ""
    source_only: bool = False


@dataclass
class TreeNode:
    directories: dict[str, "TreeNode"] = field(default_factory=dict)
    pages: list[Page] = field(default_factory=list)


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []
        self.title_parts: list[str] = []
        self.in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        url_attributes = {
            "a": ("href",),
            "area": ("href",),
            "audio": ("src",),
            "embed": ("src",),
            "iframe": ("src",),
            "img": ("src", "srcset"),
            "link": ("href",),
            "object": ("data",),
            "script": ("src",),
            "source": ("src", "srcset"),
            "track": ("src",),
            "video": ("src", "poster"),
        }
        for attribute in url_attributes.get(tag, ()):
            value = attributes.get(attribute)
            if value:
                if attribute == "srcset":
                    self.links.extend(
                        item.strip().split()[0]
                        for item in value.split(",")
                        if item.strip()
                    )
                else:
                    self.links.append(value.strip())
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)


def normalize_url(url: str) -> str:
    url, _fragment = urldefrag(url)
    parts = urlsplit(url)
    path = parts.path or "/"
    path = quote(path, safe="/%:@!$&()*+,;=-._~")
    query = quote(parts.query, safe="=&?/:@$()*+,;%-._~")
    return urlunsplit((parts.scheme.lower(), parts.netloc.lower(), path, query, ""))


def is_same_host(url: str, hostname: str) -> bool:
    return urlsplit(url).hostname == hostname


def fetch(url: str, timeout: float) -> tuple[bytes, int, str, str]:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=timeout) as response:
        final_url = response.geturl()
        content_type = response.headers.get_content_type().lower()
        if (
            content_type in HTML_CONTENT_TYPES
            or content_type in TEXT_CONTENT_TYPES
            or content_type.startswith("text/")
        ):
            body = response.read(MAX_TEXT_BYTES)
        else:
            body = b""
        return body, response.status, content_type, final_url


def github_repository_tree(
    repository: str, timeout: float
) -> tuple[list[dict[str, object]], list[str]]:
    api_url = f"https://api.github.com/repos/{repository}/git/trees/HEAD?recursive=1"
    try:
        body, _status, _content_type, _final_url = fetch(api_url, timeout)
        data = json.loads(body)
    except (HTTPError, URLError, OSError, ValueError, json.JSONDecodeError) as error:
        if isinstance(error, HTTPError) and error.code == 404:
            return [], []
        return [], [f"Could not enumerate public GitHub repository {repository}: {error}"]

    if "tree" not in data:
        message = data.get("message", "GitHub API response did not contain a repository tree")
        return [], [f"Could not enumerate public GitHub repository {repository}: {message}"]
    warnings = []
    if data.get("truncated"):
        warnings.append(f"GitHub returned a truncated tree for {repository}; some files may be missing.")
    return data["tree"], warnings


def github_tree_urls(
    tree: list[dict[str, object]], origin: str, path_prefix: str = ""
) -> set[str]:
    urls: set[str] = set()
    for item in tree:
        if item.get("type") != "blob":
            continue
        path = str(item.get("path", ""))
        if not path or any(part.startswith((".", "_")) for part in path.split("/")):
            continue
        urls.add(f"{origin}/{path_prefix}{quote(path, safe='/')}")
        if path.lower().endswith("/index.html"):
            directory = path.rsplit("/", 1)[0]
            urls.add(f"{origin}/{path_prefix}{quote(directory, safe='/')}/")
    return urls


def is_crawlable_source_url(url: str) -> bool:
    path = unquote(urlsplit(url).path)
    suffix = Path(path).suffix.lower()
    return not suffix or suffix in {
        ".html",
        ".htm",
        ".js",
        ".mjs",
        ".css",
        ".json",
        ".xml",
        ".txt",
        ".md",
    }


def github_pages_tree_urls(
    start_url: str, timeout: float
) -> tuple[set[str], set[str], list[str]]:
    hostname = urlsplit(start_url).hostname or ""
    if not hostname.endswith(".github.io"):
        return set(), set(), []

    owner = hostname.removesuffix(".github.io")
    repository = f"{owner}/{owner}.github.io"
    tree, warnings = github_repository_tree(repository, timeout)
    origin = f"{urlsplit(start_url).scheme}://{urlsplit(start_url).netloc}"
    urls = github_tree_urls(tree, origin)
    root_paths = {
        str(item.get("path", "")).split("/", 1)[0]
        for item in tree
        if item.get("path")
    }
    return urls, root_paths, warnings


def github_project_tree_urls(
    start_url: str, project: str, timeout: float
) -> tuple[set[str], list[str]]:
    hostname = urlsplit(start_url).hostname or ""
    owner = hostname.removesuffix(".github.io")
    tree, warnings = github_repository_tree(f"{owner}/{project}", timeout)
    origin = f"{urlsplit(start_url).scheme}://{urlsplit(start_url).netloc}"
    return github_tree_urls(tree, origin, f"{quote(project, safe='')}/"), warnings


def sitemap_urls(
    sitemap_url: str, hostname: str, timeout: float, delay: float
) -> tuple[set[str], list[str]]:
    found: set[str] = set()
    warnings: list[str] = []
    pending = [sitemap_url]
    visited: set[str] = set()

    while pending:
        current = normalize_url(pending.pop())
        if current in visited or not is_same_host(current, hostname):
            continue
        visited.add(current)
        try:
            time.sleep(delay)
            body, _status, _content_type, final_url = fetch(current, timeout)
            if not is_same_host(final_url, hostname):
                warnings.append(f"Skipped sitemap redirecting off-site: {current}")
                continue
            root = ET.fromstring(body)
        except HTTPError as error:
            if error.code != 404:
                warnings.append(f"Could not read sitemap {current}: {error}")
            continue
        except (URLError, OSError, ET.ParseError, ValueError) as error:
            warnings.append(f"Could not read sitemap {current}: {error}")
            continue

        root_name = root.tag.rsplit("}", 1)[-1].lower()
        for location in root.iter():
            if location.tag.rsplit("}", 1)[-1].lower() != "loc" or not location.text:
                continue
            target = normalize_url(urljoin(current, location.text.strip()))
            if not is_same_host(target, hostname):
                continue
            if root_name == "sitemapindex":
                pending.append(target)
            elif root_name == "urlset":
                found.add(target)
    return found, warnings


def load_robots(
    robots_url: str, timeout: float, delay: float
) -> tuple[RobotFileParser, list[str]]:
    parser = RobotFileParser(robots_url)
    warnings: list[str] = []
    try:
        time.sleep(delay)
        body, _status, _content_type, _final_url = fetch(robots_url, timeout)
        parser.parse(body.decode("utf-8", errors="replace").splitlines())
    except HTTPError as error:
        if error.code != 404:
            warnings.append(f"Could not read robots.txt; proceeding without its rules: {error}")
        parser.parse([])
    except (URLError, OSError, ValueError) as error:
        warnings.append(f"Could not read robots.txt; proceeding without its rules: {error}")
        parser.parse([])
    return parser, warnings


def build_tree(pages: Iterable[Page]) -> TreeNode:
    root = TreeNode()
    for page in pages:
        path = urlsplit(page.url).path
        segments = [segment for segment in path.split("/") if segment]
        if not segments:
            directories: list[str] = []
        elif path.endswith("/"):
            directories = segments
        else:
            directories = segments[:-1]

        node = root
        for segment in directories:
            node = node.directories.setdefault(segment, TreeNode())
        node.pages.append(page)
    return root


def render_tree(node: TreeNode, depth: int = 0) -> list[str]:
    lines: list[str] = []
    for name, child in sorted(node.directories.items(), key=lambda item: item[0].lower()):
        lines.append(f'{"  " * depth}- **{name}/**')
        lines.extend(render_tree(child, depth + 1))
    for page in sorted(node.pages, key=lambda item: item.url.lower()):
        path = urlsplit(page.url).path
        leaf = "index" if path.endswith("/") else next(
            (part for part in reversed(path.split("/")) if part), "index"
        )
        query = urlsplit(page.url).query
        if query:
            leaf = f"{leaf}?{query}"
        status = f" - HTTP {page.status}" if page.status is not None else ""
        if page.source_only:
            status = " - repository entry; not fetched"
        title = f" - {page.title}" if page.title else ""
        lines.append(f'{"  " * depth}- [{leaf}]({page.url}){status}{title}')
    return lines


def write_report(
    output: Path,
    start_url: str,
    pages: list[Page],
    warnings: list[str],
    truncated: bool,
    not_found_count: int,
) -> None:
    tree = build_tree(pages)
    lines = [
        f"# Public page tree for {start_url}",
        "",
        f"Found **{len(pages)} public URL(s)** using public GitHub repository "
        "trees, sitemaps, and same-host page links.",
        "",
        "> This is a public-surface inventory, not a guarantee of every URL on the "
        "site. The crawler uses public repository files for GitHub Pages, plus "
        "sitemaps and same-site links. Pages not exposed by those sources cannot be "
        "found without already knowing their URLs. Entries marked `repository entry; "
        "not fetched` come from source trees and may not be published. It does not "
        "guess paths or bypass access controls.",
        "",
        "## Pages",
        "",
    ]
    lines.extend(render_tree(tree) or ["No pages were discovered."])

    errors = [page for page in pages if page.error]
    if errors or warnings or truncated or not_found_count:
        lines.extend(["", "## Crawl notes", ""])
        if truncated:
            lines.append("- Stopped at the configured page limit; some queued URLs may remain.")
        if not_found_count:
            lines.append(f"- Omitted {not_found_count} candidate URL(s) that returned HTTP 404.")
        lines.extend(f"- {warning}" for warning in warnings)
        lines.extend(f"- Could not fetch [{page.url}]({page.url}): {page.error}" for page in errors)

    output.write_text("\n".join(lines) + "\n", encoding="utf-8")


def crawl(
    start_url: str,
    output: Path,
    max_pages: int,
    max_depth: int,
    delay: float,
    timeout: float,
) -> None:
    start_url = normalize_url(start_url)
    parsed_start = urlsplit(start_url)
    if parsed_start.scheme not in {"http", "https"} or not parsed_start.hostname:
        raise ValueError("Start URL must be an absolute HTTP or HTTPS URL.")
    hostname = parsed_start.hostname
    origin = f"{parsed_start.scheme}://{parsed_start.netloc}"

    robots, warnings = load_robots(f"{origin}/robots.txt", timeout, delay)
    repository_urls, root_paths, repository_warnings = github_pages_tree_urls(start_url, timeout)
    source_urls = set(repository_urls)
    seeds: set[str] = {start_url}
    warnings.extend(repository_warnings)

    sitemap_locations = robots.site_maps() or []
    for sitemap_url in sitemap_locations:
        found, sitemap_warnings = sitemap_urls(sitemap_url, hostname, timeout, delay)
        seeds.update(found)
        warnings.extend(sitemap_warnings)

    if not sitemap_locations:
        default_sitemap = f"{origin}/sitemap.xml"
        found, sitemap_warnings = sitemap_urls(default_sitemap, hostname, timeout, delay)
        seeds.update(found)
        warnings.extend(sitemap_warnings)

    queue = deque((url, 0) for url in sorted(seeds))
    queued = set(seeds)
    for url in repository_urls:
        if is_crawlable_source_url(url) and robots.can_fetch(USER_AGENT, url):
            if url not in queued:
                queued.add(url)
                queue.append((url, 0))
    visited: set[str] = set()
    pages: list[Page] = []
    expanded_projects: set[str] = set()
    requests_made = 0

    while queue and requests_made < max_pages:
        url, depth = queue.popleft()
        if url in visited:
            continue
        visited.add(url)
        if not robots.can_fetch(USER_AGENT, url):
            continue

        requests_made += 1
        page = Page(url=url, status=None, content_type="")
        pages.append(page)
        try:
            time.sleep(delay)
            body, status, content_type, final_url = fetch(url, timeout)
            if not is_same_host(final_url, hostname):
                page.error = f"redirected to a different host ({final_url})"
                continue
            page.url = normalize_url(final_url)
            page.status = status
            page.content_type = content_type
            if content_type in HTML_CONTENT_TYPES:
                parser = LinkParser()
                parser.feed(body.decode("utf-8", errors="replace"))
                page.title = " ".join(" ".join(parser.title_parts).split())
                links = parser.links
            elif content_type in TEXT_CONTENT_TYPES or content_type.startswith("text/"):
                text = body.decode("utf-8", errors="replace")
                links = [match.rstrip("),.;]}") for match in ABSOLUTE_URL.findall(text)]
            else:
                links = []

            if depth < max_depth:
                for href in links:
                    try:
                        target = normalize_url(urljoin(page.url, href))
                    except ValueError as error:
                        warning = f"Skipped invalid link from {page.url}: {error}"
                        if warning not in warnings:
                            warnings.append(warning)
                        continue
                    if (
                        urlsplit(target).scheme in {"http", "https"}
                        and is_same_host(target, hostname)
                    ):
                        target_parts = urlsplit(target)
                        segments = [unquote(part) for part in target_parts.path.split("/") if part]
                        if (
                            target_parts.path.endswith("/")
                            and segments
                            and segments[0] not in root_paths
                            and segments[0] not in expanded_projects
                            and hostname.endswith(".github.io")
                        ):
                            project = segments[0]
                            expanded_projects.add(project)
                            project_urls, project_warnings = github_project_tree_urls(
                                start_url, project, timeout
                            )
                            warnings.extend(project_warnings)
                            source_urls.update(project_urls)
                            for project_url in project_urls:
                                if (
                                    is_crawlable_source_url(project_url)
                                    and project_url not in queued
                                ):
                                    queued.add(project_url)
                                    queue.append((project_url, depth + 1))
                        if target not in queued:
                            queued.add(target)
                            queue.append((target, depth + 1))
        except HTTPError as error:
            page.status = error.code
            page.error = f"HTTP {error.code} {error.reason}"
        except (URLError, OSError, ValueError) as error:
            page.error = str(error)

    not_found_count = sum(page.status == 404 for page in pages)
    report_pages = [page for page in pages if page.status != 404]
    checked_urls = {normalize_url(url) for url in visited}
    for url in source_urls:
        if (
            normalize_url(url) not in checked_urls
            and robots.can_fetch(USER_AGENT, url)
        ):
            report_pages.append(Page(url, None, "", source_only=True))
    write_report(
        output,
        start_url,
        report_pages,
        warnings,
        bool(queue) and requests_made >= max_pages,
        not_found_count,
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Build a Markdown tree of public pages discoverable on one website."
    )
    parser.add_argument(
        "url",
        nargs="?",
        default="https://ib-hussain.github.io/",
        help="website start URL (default: https://ib-hussain.github.io/)",
    )
    parser.add_argument(
        "-o", "--output", type=Path, default=Path("website-tree.md"),
        help="Markdown output path (default: website-tree.md)",
    )
    parser.add_argument("--max-pages", type=int, default=5000, help="maximum pages to fetch")
    parser.add_argument("--max-depth", type=int, default=50, help="maximum link depth")
    parser.add_argument("--delay", type=float, default=0.25, help="seconds between requests")
    parser.add_argument("--timeout", type=float, default=15.0, help="request timeout in seconds")
    args = parser.parse_args()
    if args.max_pages < 1 or args.max_depth < 0 or args.delay < 0 or args.timeout <= 0:
        parser.error("limits must be positive (max-depth may be zero; delay may be zero)")

    try:
        crawl(args.url, args.output, args.max_pages, args.max_depth, args.delay, args.timeout)
    except (OSError, ValueError) as error:
        parser.error(str(error))
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
