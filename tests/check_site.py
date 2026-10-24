#!/usr/bin/env python3
"""Static link, metadata and structural checks. Python standard library only."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import sys
ROOT=Path(__file__).resolve().parents[1]
PAGES=['index.html','contact.html','photos.html','terminal.html','resume.html','music.html','movies.html','projects.html','bin.html',
       'tracks/quant.html','tracks/ml-ai.html','tracks/engineering.html','tracks/analytics.html',
       'experience.html','about.html','components.html']
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
 for missing,okay in [('unique H1',len(doc.headers)==1),('main region',doc.has_main),('meta description',bool(doc.meta))]:
  if not okay:errors.append(f'{p}: {missing} failed')
 if '<link rel="icon" type="image/png" href="'+('../' if p.startswith('tracks/') else '')+'assets/favicon.png">' not in f.read_text(encoding='utf-8'):
  errors.append(f'{p}: favicon missing')
 for tag,link in doc.refs:
  if link.startswith(('mailto:','tel:','data:','javascript:','#')):continue
  parsed=urlsplit(link)
  if parsed.scheme or parsed.netloc:continue
  tgt=(f.parent/unquote(parsed.path)).resolve()
  if not tgt.is_relative_to(ROOT):errors.append(f'{p}: suspicious path {link}');continue
  if not tgt.exists():errors.append(f'{p}: broken local link {link}')
  if parsed.fragment and tgt==f.resolve() and parsed.fragment not in doc.anchors:errors.append(f'{p}: broken anchor {link}')
for must in ['robots.txt','sitemap.xml','llms.txt','.nojekyll','css/site.css','css/iteration2.css','js/site.js','js/skills-planet.js','js/photo-data.js','js/liquid-sculpture.js','js/tv-shader.js','scripts/update_public_data.py','.github/workflows/data.yml','component-lab/index.html','vendor/halftone-background2.html','vendor/ridgeline-dither-footer-Component2.html']:
 if not (ROOT/must).exists(): errors.append('Required file missing: '+must)
site=(ROOT/'js/site.js').read_text()
labels=['Contact Me','Photos','Terminal','Resume','Music','Movies','Projects','Bin']
positions=[site.find("'"+label+"'") for label in labels]
if any(pos<0 for pos in positions) or positions!=sorted(positions):errors.append('Desktop dock labels or order changed')
if "page!=='bin'&&page!=='terminal'" not in site:errors.append('Bin/terminal chrome exceptions changed')
index=(ROOT/'index.html').read_text()
sections=['id="top"','id="intro"','id="numbers"','id="skills"','id="photos-preview"']
positions=[index.find(section) for section in sections]
if any(pos<0 for pos in positions) or positions!=sorted(positions):errors.append('Home section order changed')
if "assets/Ibrahim's Resume.pdf" not in (ROOT/'resume.html').read_text():errors.append('Résumé PDF link changed')
bin_page=(ROOT/'bin.html').read_text()
if bin_page.count('class="bin-environment')!=2 or 'id="footer-host"' in bin_page or 'bin-exit' not in bin_page:errors.append('Bin page visual sections or focus exit changed')
for name in ['about.html','experience.html','components.html']:
 if name in site[:site.index('const titles=')]:errors.append('Legacy page appeared in dock: '+name)
if errors:
 print('\n'.join('ERROR: '+e for e in errors));sys.exit(1)
print(f'PASS: {len(PAGES)} pages, local links, headings, metadata, favicon, runtime and component assets')
