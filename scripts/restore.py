#!/usr/bin/env python3
"""Verify checksum and restore to a NEW empty destination; never silently overwrite."""
from pathlib import Path
from zipfile import ZipFile
import hashlib,sys
if len(sys.argv)!=3:raise SystemExit('Usage: python scripts/restore.py /path/backup.zip /path/empty-destination')
archive,destination=map(Path,sys.argv[1:]);check=archive.with_suffix('.sha256')
if not check.exists():raise SystemExit('Missing checksum file')
expected=check.read_text().split()[0];actual=hashlib.sha256(archive.read_bytes()).hexdigest()
if expected!=actual:raise SystemExit('Checksum mismatch; restore aborted')
if destination.exists():raise SystemExit('Restore destination already exists; use a new path')
with ZipFile(archive) as z:
 for info in z.infolist():
  p=Path(info.filename)
  if p.is_absolute() or '..' in p.parts:raise SystemExit('Unsafe archive member: '+info.filename)
 destination.mkdir(parents=True)
 z.extractall(destination)
print('Restored to',destination)
