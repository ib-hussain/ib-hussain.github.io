#!/usr/bin/env python3
"""Refresh public GitHub metrics and Letterboxd diary for the static site."""
import json
import os
from pathlib import Path
from datetime import datetime, timezone
from collections import Counter
from html.parser import HTMLParser
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PROFILE = 'https://letterboxd.com/ib_hussain_/'
NS = {'lb': 'https://letterboxd.com', 'dc': 'http://purl.org/dc/elements/1.1/'}

class PlainText(HTMLParser):
    def __init__(self):
        super().__init__(); self.parts=[]; self.skip=0
    def handle_starttag(self, tag, attrs):
        if tag in ('script','style'): self.skip+=1
        if tag in ('p','br') and self.parts: self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag in ('script','style') and self.skip: self.skip-=1
        if tag=='p' and self.parts: self.parts.append('\n')
    def handle_data(self, data):
        if not self.skip: self.parts.append(data)

def text_only(html):
    parser=PlainText(); parser.feed(html or '')
    return '\n'.join(line.strip() for line in ''.join(parser.parts).splitlines() if line.strip())[:1400]

def fetch(url):
    headers={'User-Agent':'IbrahimPortfolioData/1.0 (+https://ib-hussain.github.io/)', 'Accept':'application/json, application/rss+xml, application/xml'}
    token=os.environ.get('GITHUB_TOKEN')
    if token and 'api.github.com' in url:headers['Authorization']='Bearer '+token
    with urlopen(Request(url,headers=headers),timeout=25) as response:return response.read()

def github_data(fetcher=fetch):
    base='https://api.github.com/users/ib-hussain'
    user=json.loads(fetcher(base))
    repos=json.loads(fetcher(base+'/repos?per_page=100&sort=updated&type=public'))
    events=json.loads(fetcher(base+'/events/public?per_page=100'))
    counts=Counter(r['language'] for r in repos if r.get('language') and not r.get('fork'))
    return {'updated_at':datetime.now(timezone.utc).isoformat(timespec='seconds'),
            'public_repos':user.get('public_repos'), 'recent_push_events':sum(e.get('type')=='PushEvent' for e in events),
            'followers':user.get('followers'),'top_language':counts.most_common(1)[0][0] if counts else None}

def parse_letterboxd(rss):
    root=ET.fromstring(rss)
    reviews=[]
    for item in root.findall('./channel/item'):
        def val(name):return (item.findtext(name,namespaces=NS) or '').strip()
        title=val('lb:filmTitle') or val('title').split(' - ')[0]
        url=val('link')
        if not title or not url.startswith(PROFILE):continue
        year=val('lb:filmYear')
        try:rating=float(val('lb:memberRating'))
        except ValueError:rating=None
        description=text_only(val('description'))
        # The RSS description may contain only poster markup; keep the diary entry nonetheless.
        reviews.append({'title':title,'year':year if year.isdigit() else '', 'rating':rating,
                        'watchedDate':val('lb:watchedDate'),'published':val('pubDate'),
                        'review':description,'url':url})
    return reviews

def letterboxd_data(fetcher=fetch):
    path=ROOT/'data/films.json'
    old=json.loads(path.read_text()) if path.exists() else {}
    reviews=parse_letterboxd(fetcher(PROFILE+'rss/'))
    # The favorites are the four films curated on the public profile, independent of diary scores.
    return {'letterboxdProfile':PROFILE,'favorites':old.get('favorites',['About Time','Casablanca','Frozen','Babylon']),
            'reviews':reviews,'updatedAt':datetime.now(timezone.utc).isoformat(timespec='seconds')}

def write(path,data):path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')

def main():
    successful=0
    for label,fn,path in [('github',github_data,ROOT/'data/github.json'),('letterboxd',letterboxd_data,ROOT/'data/films.json')]:
        try:write(path,fn());successful+=1;print(label+' refreshed')
        except Exception as exc:print(label+' refresh failed: '+str(exc),file=__import__('sys').stderr)
    if successful==0:raise SystemExit('No public data sources succeeded')
if __name__=='__main__':main()
