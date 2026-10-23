#!/usr/bin/env python3
"""Make an SHA-256-verified source snapshot (without secrets or .git)."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib,datetime,json
root=Path(__file__).resolve().parents[1]
backup=root/'backups';backup.mkdir(exist_ok=True)
stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
out=backup/f'portfolio-{stamp}.zip'
with ZipFile(out,'w',ZIP_DEFLATED) as z:
 for f in root.rglob('*'):
  if not f.is_file() or any(x in f.parts for x in ('.git','backups','__pycache__')):continue
  z.write(f,f.relative_to(root))
sha=hashlib.sha256(out.read_bytes()).hexdigest()
(out.with_suffix('.sha256')).write_text(sha+'  '+out.name+'\n')
print(out,'SHA256:',sha)
