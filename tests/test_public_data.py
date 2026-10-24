#!/usr/bin/env python3
"""Fixture checks for the public data refresh without network access."""
import importlib.util
import json
import unittest
from pathlib import Path

module=Path(__file__).resolve().parents[1]/'scripts/update_public_data.py'
spec=importlib.util.spec_from_file_location('public_data',module)
data=importlib.util.module_from_spec(spec);spec.loader.exec_module(data)

class PublicDataTests(unittest.TestCase):
 def test_letterboxd_rss(self):
  rss=b'''<?xml version="1.0"?><rss xmlns:letterboxd="https://letterboxd.com"><channel><item><title>Film (2024)</title><link>https://letterboxd.com/ib_hussain_/film/film/</link><letterboxd:filmTitle>Film</letterboxd:filmTitle><letterboxd:filmYear>2024</letterboxd:filmYear><letterboxd:memberRating>4.5</letterboxd:memberRating><letterboxd:watchedDate>2026-10-01</letterboxd:watchedDate><description><![CDATA[<img src="x"><p>A personal note &amp; reflection.</p><script>ignore</script>]]></description></item><item><title>Someone else's film</title><link>https://letterboxd.com/other/film/x/</link></item></channel></rss>'''
  films=data.parse_letterboxd(rss)
  self.assertEqual(len(films),1)
  self.assertEqual((films[0]['title'],films[0]['year'],films[0]['rating']),('Film','2024',4.5))
  self.assertEqual(films[0]['review'],'A personal note & reflection.')
  self.assertEqual(films[0]['watchedDate'],'2026-10-01')
 def test_github_public_metrics(self):
  def fake(url):
   if '/repos?' in url:return json.dumps([{'language':'Python','fork':False},{'language':'Python','fork':False},{'language':'JavaScript','fork':False}]).encode()
   if '/events/' in url:return json.dumps([{'type':'PushEvent'},{'type':'WatchEvent'}]).encode()
   return json.dumps({'public_repos':12,'followers':5}).encode()
  result=data.github_data(fake)
  self.assertEqual((result['public_repos'],result['followers'],result['recent_push_events'],result['top_language']),(12,5,1,'Python'))
if __name__=='__main__':unittest.main()
