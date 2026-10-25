#!/usr/bin/env python3
"""Refresh the static movie profile from public Letterboxd HTML and RSS.

The browser reads src/data/films.json. This script runs in GitHub Actions, so
Letterboxd's client-side CORS policy does not affect the page.
"""
from __future__ import annotations

from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys
from urllib.parse import urlparse
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None  # Standard-library fallback for local runs; Actions installs bs4.

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / 'src/data/films.json'
POSTER_DIR = ROOT / 'src/movies/data/posters'
PROFILE_URL = 'https://letterboxd.com/ib_hussain_/'
RSS_URL = PROFILE_URL + 'rss/'
LB_NS = {'lb': 'https://letterboxd.com'}
USER_AGENT = 'IbrahimFilmJournal/1.0 (+https://ib-hussain.github.io/)'
MAX_IMAGE_BYTES = 3_000_000
LOCAL_PAGES = {
    'about-time': 'data/about-time.html',
    'casablanca': 'data/casablanca.html',
    'frozen-2013': 'data/frozen.html',
    'babylon-2022': 'data/babylon.html',
}

class TextAndImages(HTMLParser):
    def __init__(self):
        super().__init__(); self.text=[]; self.images=[]; self.ignored=0
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag in ('script','style'):self.ignored+=1
        if tag=='img':
            src=attrs.get('src') or attrs.get('data-src')
            if src:self.images.append(src)
        if tag in ('p','br','div','blockquote') and self.text:self.text.append('\n')
    def handle_endtag(self, tag):
        if tag in ('script','style') and self.ignored:self.ignored-=1
        if tag in ('p','div','blockquote') and self.text:self.text.append('\n')
    def handle_data(self, value):
        if not self.ignored:self.text.append(value)

def extract_review_html(value):
    """Return paragraphs and a candidate poster, excluding image alt and scripts."""
    if BeautifulSoup:
        soup=BeautifulSoup(value or '', 'html.parser')
        img=soup.find('img')
        poster=(img.get('src') or img.get('data-src')) if img else None
        for tag in soup(['script','style','img']):tag.decompose()
        parts=[part.strip() for part in soup.get_text('\n').splitlines() if part.strip()]
        return '\n'.join(parts)[:6000],poster
    parser=TextAndImages();parser.feed(value or '')
    parts=[unescape(part.strip()) for part in ''.join(parser.text).splitlines() if part.strip()]
    return '\n'.join(parts)[:6000],next(iter(parser.images),None)

def parse_rss(xml_bytes, previous_reviews=()):
    prior={item.get('slug'):item for item in previous_reviews if item.get('slug')}
    root=ET.fromstring(xml_bytes)
    items=root.findall('./channel/item')
    parsed=[]
    for item in items:
        def field(name):return (item.findtext(name,namespaces=LB_NS) or '').strip()
        title=field('lb:filmTitle') or re.split(r'\s*[-–]\s*',field('title'))[0]
        url=field('link')
        match=re.match(r'^https://letterboxd\.com/ib_hussain_/film/([a-z0-9-]+)/',url)
        if not title or not match:continue
        if field('guid').startswith('letterboxd-watch-'):continue
        slug=match.group(1)
        review,image_url=extract_review_html(field('description'))
        if not review or re.fullmatch(r'Watched on .+\.?',review,re.I):continue
        try:year=int(field('lb:filmYear'))
        except ValueError:year=None
        try:rating=float(field('lb:memberRating'))
        except ValueError:rating=None
        if rating is not None and not (.5<=rating<=5):rating=None
        watched=field('lb:watchedDate')
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}',watched):watched=None
        old=prior.get(slug,{})
        liked=field('lb:memberLike').lower()
        if liked in ('yes','true','1'):liked=True
        elif liked in ('no','false','0'):liked=False
        else:liked=old.get('liked')
        parsed.append({'title':title,'year':year or old.get('year'),'slug':slug,
                       'poster':old.get('poster',''), 'posterSource':image_url or old.get('posterSource',''),
                       'rating':rating,'liked':liked,'watchedDate':watched or old.get('watchedDate'),
                       'review':review, **({'page':LOCAL_PAGES[slug]} if slug in LOCAL_PAGES else {})})
    return parsed

def _plain_html(value):
    return re.sub(r'\s+',' ',unescape(re.sub(r'<[^>]*>',' ',value))).strip()

def parse_profile(html_bytes, previous):
    """Read public stats and the four ordered favourite films; retain prior fields on layout changes."""
    html=html_bytes.decode('utf-8','replace')
    data=dict(previous)
    stats=dict(data.get('stats') or {})
    soup=BeautifulSoup(html,'html.parser') if BeautifulSoup else None
    if soup:
        for tag in soup(['script','style']):tag.decompose()
    plain=soup.get_text(' ',strip=True) if soup else _plain_html(html)
    for label,key in [('films','films'),('this year','thisYear'),('following','following'),('followers','followers')]:
        # A profile layout may place the count before or after its label.
        patterns=[rf'\b([\d,]+)\s*{re.escape(label)}\b',rf'\b{re.escape(label)}\s*([\d,]+)\b']
        for pattern in patterns:
            match=re.search(pattern,plain,re.I)
            if match:
                stats[key]=int(match.group(1).replace(',',''))
                break
    data['stats']=stats
    favorites=[]
    if BeautifulSoup:
        name=soup.select_one('.person-display-name, .profile-name, h1.person-display-name')
        if name and name.get_text(strip=True):data['name']=name.get_text(' ',strip=True)
        bio=soup.select_one('.profile-bio, .person-bio, .bio')
        if bio and bio.get_text(strip=True):data['bio']=bio.get_text(' ',strip=True)
        loc=soup.select_one('.profile-location, .location')
        if loc and loc.get_text(strip=True):data['location']=loc.get_text(' ',strip=True)
        region=soup.select_one('#favourites, #favorites, .favorite-films, .favourite-films')
        if not region:
            heading=soup.find(string=re.compile(r'favou?rite films',re.I))
            if heading:region=heading.parent.find_next(['ul','section'])
        if region:
            for item in region.select('li, .poster-container'):
                nested=item.find(attrs={'data-film-name':True}) or item.find(attrs={'data-film-title':True})
                name=item.get('data-film-name') or item.get('data-film-title') or (nested.get('data-film-name') or nested.get('data-film-title') if nested else '')
                image=item.find('img')
                if not name and image:name=image.get('alt')
                anchor=item.find('a',href=re.compile(r'/film/'))
                href=anchor.get('href','') if anchor else ''
                slug_match=re.search(r'/film/([a-z0-9-]+)/',href)
                if not name or not slug_match:continue
                poster_url=(image.get('data-src') or image.get('src')) if image else ''
                if poster_url.startswith('//'):poster_url='https:'+poster_url
                favorites.append({'title':name.strip(),'slug':slug_match.group(1),'posterSource':poster_url})
                if len(favorites)==4:break
    return data,favorites if len(favorites)==4 and len({x['slug'] for x in favorites})==4 else []

def fetch(url):
    request=Request(url,headers={'User-Agent':USER_AGENT,'Accept':'text/html, application/rss+xml, image/*'})
    with urlopen(request,timeout=30) as response:
        return response.read()

def valid_poster_url(url):
    if not isinstance(url,str):return False
    parsed=urlparse(url)
    host=(parsed.hostname or '').lower()
    return parsed.scheme=='https' and (host.endswith('.ltrbxd.com') or host=='image.tmdb.org')

def download_poster(slug,url,fetcher=fetch):
    if not valid_poster_url(url) or not re.fullmatch(r'[a-z0-9-]{1,90}',slug):return ''
    poster=POSTER_DIR/(slug+'.jpg')
    if poster.exists() and poster.stat().st_size>100:return 'data/posters/'+poster.name
    try:
        image=fetcher(url)
        if len(image)>MAX_IMAGE_BYTES or len(image)<100:return ''
        if image.startswith(b'\xff\xd8\xff'):ext='.jpg'
        elif image.startswith(b'RIFF') and image[8:12]==b'WEBP':ext='.webp'
        elif image.startswith(b'\x89PNG\r\n\x1a\n'):ext='.png'
        else:return ''
        poster=POSTER_DIR/(slug+ext);poster.parent.mkdir(parents=True,exist_ok=True)
        poster.write_bytes(image)
        return 'data/posters/'+poster.name
    except Exception as error:
        print(f'Poster skipped ({slug}): {error}',file=sys.stderr)
        return ''

def merge_favorites(found,existing):
    # The four local pages are curated. A changed remote favourite cannot create a dead link.
    by_slug={item['slug']:item for item in found if item['slug'] in LOCAL_PAGES}
    result=[]
    for cached in existing:
        slug=cached.get('slug')
        if slug not in LOCAL_PAGES:continue
        item=by_slug.get(slug,{})
        result.append({**cached,'title':item.get('title') or cached['title'],
                       'page':LOCAL_PAGES[slug],
                       'posterSource':item.get('posterSource') or cached.get('posterSource','')})
    return result

def refresh(fetcher=fetch,download=True):
    data=json.loads(DATA_PATH.read_text(encoding='utf-8'))
    updated=0
    try:
        profile,favorites=parse_profile(fetcher(PROFILE_URL),data.get('profile',{}))
        data['profile']=profile
        data['favorites']=merge_favorites(favorites,data.get('favorites',[]))
        updated+=1;print('Profile refreshed')
    except Exception as error:print(f'Profile refresh skipped: {error}',file=sys.stderr)
    try:
        reviews=parse_rss(fetcher(RSS_URL),data.get('reviews',[]))
        if not reviews:raise ValueError('RSS had no public reviews; retaining previous diary')
        data['reviews']=reviews[:12]
        data['reviewsUpdatedAt']=datetime.now(timezone.utc).isoformat(timespec='seconds')
        updated+=1;print(f'RSS refreshed ({len(reviews)} reviews)')
    except Exception as error:print(f'RSS refresh skipped: {error}',file=sys.stderr)
    if updated==0:raise RuntimeError('No Letterboxd source could be refreshed; existing JSON left intact')
    favorite_by_slug={f.get('slug'):f for f in data.get('favorites',[])}
    for film in data.get('reviews',[]):
        favorite=favorite_by_slug.get(film.get('slug'))
        if favorite and favorite.get('poster') and not film.get('poster'):film['poster']=favorite['poster']
        if favorite and film.get('review') and not favorite.get('snippet'):
            favorite['snippet']=film['review'][:150]
    if download:
        for film in [*data.get('favorites',[]),*data.get('reviews',[])]:
            current=film.get('poster','')
            if current.startswith('data/') and (ROOT/'src/movies'/current).exists():continue
            path=download_poster(film.get('slug',''),film.get('posterSource',''),fetcher)
            if path:film['poster']=path
    # Only local, packaged images and the four known local page routes reach the frontend JSON.
    for film in [*data.get('favorites',[]),*data.get('reviews',[])]:
        film.pop('url',None)
        film.pop('posterSource',None)
        if film.get('slug') in LOCAL_PAGES:film['page']=LOCAL_PAGES[film['slug']]
        else:film.pop('page',None)
        poster=film.get('poster','')
        if not isinstance(poster,str) or not poster.startswith('data/') or not (ROOT/'src/movies'/poster).is_file():
            film['poster']=''
    data.get('profile',{}).pop('url',None)
    data['updatedAt']=datetime.now(timezone.utc).isoformat(timespec='seconds')
    data['source']='Public Letterboxd profile and RSS feed'
    DATA_PATH.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    return data

if __name__=='__main__':refresh()
