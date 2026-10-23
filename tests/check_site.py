#!/usr/bin/env python3
"""Static link, metadata and structural checks. Python standard library only."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import sys
ROOT=Path(__file__).resolve().parents[1]
PAGES=['index.html','projects.html','experience.html','about.html','contact.html','components.html']
class Check(HTMLParser):
 def __init__(self):super().__init__();self.refs=[];self.headers=[];self.meta=[];self.anchors=set();self.has_main=False;self.has_nav=False
 def handle_starttag(self,tag,attrs):
  at=dict(attrs)
  if tag=='h1': self.headers.append(tag)
  if tag=='main':self.has_main=True
  if tag=='nav': self.has_nav=True
  if 'id' in at:self.anchors.add(at['id'])
  if tag=='meta' and at.get('name')=='description':self.meta.append(at.get('content'))
  for attr in ['src','href']:
   if at.get(attr):self.refs.append((tag,at[attr]))
errors=[]
for p in PAGES:
 f=ROOT/p
 if not f.is_file():errors.append(f'Missing page {p}');continue
 doc=Check();doc.feed(f.read_text(encoding='utf-8'))
 for missing,okay in [('unique H1',len(doc.headers)==1),('main region',doc.has_main),('navigation',doc.has_nav),('meta description',bool(doc.meta))]:
  if not okay:errors.append(f'{p}: {missing} failed')
 for tag,link in doc.refs:
  if link.startswith(('mailto:','tel:','data:','javascript:','#')):continue
  parsed=urlsplit(link)
  if parsed.scheme or parsed.netloc:continue
  tgt=(f.parent/unquote(parsed.path)).resolve()
  if not tgt.is_relative_to(ROOT):errors.append(f'{p}: suspicious path {link}');continue
  if not tgt.exists():errors.append(f'{p}: broken local link {link}')
  if parsed.fragment and tgt==f.resolve() and parsed.fragment not in doc.anchors:errors.append(f'{p}: broken anchor {link}')
for must in ['robots.txt','sitemap.xml','llms.txt','.nojekyll','css/site.css','js/site.js','component-lab/index.html','vendor/halftone-background2.html','vendor/theme-changer2.html','vendor/ridgeline-dither-footer-Component2.html']:
 if not (ROOT/must).exists(): errors.append('Required file missing: '+must)
if errors:
 print('\n'.join('ERROR: '+e for e in errors));sys.exit(1)
print('PASS: 6 pages, local links, semantic headings, metadata, runtime and component source assets')
