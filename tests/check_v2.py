"""Static smoke test for merged GitHub Pages site; Python standard library only."""
from pathlib import Path
from html.parser import HTMLParser
import re,sys
ROOT=Path(__file__).resolve().parents[1]
PAGES=['index','projects','photos','terminal','resume','music','movies','contact','bin']
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.title=False;self.h1=0;self.favicon=False;self.canonical=False
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='h1':self.h1+=1
  if tag=='link' and attrs.get('rel')=='icon' and attrs.get('href')=='assets/favicon.png':self.favicon=True
  if tag=='link' and attrs.get('rel')=='canonical':self.canonical=True
  if tag in ['script','link','img']:
   link=attrs.get('src') or attrs.get('href')
   if link and not link.startswith(('https://','http://','data:','#','mailto:')):self.links.append(link)
errs=[]
for page in PAGES:
 path=ROOT/(page+'.html')
 if not path.exists():errs.append(f'Missing page: {path.name}');continue
 p=Parser();p.feed(path.read_text(encoding='utf-8'))
 if p.h1!=1:errs.append(f'{page}: expected one h1, found {p.h1}')
 if not p.favicon:errs.append(f'{page}: missing favicon')
 if not p.canonical:errs.append(f'{page}: missing canonical link')
 for local in p.links:
  local=local.split('?')[0]
  if local and not (ROOT/local).exists():errs.append(f'{page}: missing asset {local}')
 for expected in ['js/site.js','css/site.css','js/tom-jerry-cursor.js']:
  if expected not in p.links:errs.append(f'{page}: missing {expected}')
print(f'Checked {len(PAGES)} pages, {len(errs)} issues')
for e in errs:print('ERROR:',e)
sys.exit(bool(errs))
