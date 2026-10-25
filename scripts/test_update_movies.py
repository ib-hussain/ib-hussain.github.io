#!/usr/bin/env python3
"""Offline checks for RSS parsing and graceful refresh behavior."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT=Path(__file__).with_name('update_movies.py')
spec=importlib.util.spec_from_file_location('update_movies',SCRIPT)
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

PROFILE=b'''<html><body><h1>Ibrahim Hussain</h1><ul class="profile-stats"><li>145 Films</li><li>114 This Year</li><li>29 Following</li><li>18 Followers</li></ul></body></html>'''
RSS=b'''<?xml version="1.0"?><rss xmlns:letterboxd="https://letterboxd.com"><channel>
<item><title>About Time (2013)</title><link>https://letterboxd.com/ib_hussain_/film/about-time/</link><letterboxd:filmTitle>About Time</letterboxd:filmTitle><letterboxd:filmYear>2013</letterboxd:filmYear><letterboxd:memberRating>5</letterboxd:memberRating><letterboxd:watchedDate>2026-10-26</letterboxd:watchedDate><description><![CDATA[<p><img src="https://s.ltrbxd.com/poster.jpg"></p><p>My first paragraph &amp; feeling.</p><p>My second paragraph.</p>]]></description></item>
<item><title>Diary only</title><link>https://letterboxd.com/ib_hussain_/film/diary-only/</link><guid>letterboxd-watch-123</guid><letterboxd:filmTitle>Diary only</letterboxd:filmTitle><description><![CDATA[<img src="https://s.ltrbxd.com/other.jpg"><p>Watched on Monday.</p>]]></description></item>
</channel></rss>'''

class MoviesTests(unittest.TestCase):
    def test_review_parser_uses_actual_rss_text(self):
        reviews=mod.parse_rss(RSS)
        self.assertEqual(len(reviews),1)
        self.assertEqual(reviews[0]['rating'],5)
        self.assertEqual(reviews[0]['watchedDate'],'2026-10-26')
        self.assertEqual(reviews[0]['posterSource'],'https://s.ltrbxd.com/poster.jpg')
        self.assertEqual(reviews[0]['review'],'My first paragraph & feeling.\nMy second paragraph.')

    def test_profile_counts_preserve_other_fields(self):
        profile,favorites=mod.parse_profile(PROFILE,{'bio':'ruins of a utopia','stats':{'films':1}})
        self.assertEqual(profile['stats'],{'films':145,'thisYear':114,'following':29,'followers':18})
        self.assertEqual(profile['bio'],'ruins of a utopia')
        self.assertEqual(favorites,[])

    def test_partial_failure_keeps_profile_cache(self):
        original=mod.DATA_PATH
        try:
            with tempfile.TemporaryDirectory() as directory:
                mod.DATA_PATH=Path(directory)/'films.json'
                mod.DATA_PATH.write_text(json.dumps({'schemaVersion':1,'profile':{'stats':{'films':145}},'favorites':[],'reviews':[]}))
                def fetch(url):
                    if url==mod.PROFILE_URL:raise OSError('Temporary profile error')
                    return RSS
                result=mod.refresh(fetcher=fetch,download=False)
                self.assertEqual(result['profile']['stats']['films'],145)
                self.assertEqual(result['reviews'][0]['title'],'About Time')
                self.assertEqual(result['reviews'][0]['page'],'data/about-time.html')
                self.assertNotIn('url',result['reviews'][0])
                self.assertNotIn('posterSource',result['reviews'][0])
                self.assertEqual(json.loads(mod.DATA_PATH.read_text())['reviews'][0]['title'],'About Time')
        finally:mod.DATA_PATH=original

    def test_favorites_never_expand_beyond_the_four_local_pages(self):
        existing=[{'slug':'about-time','title':'About Time','poster':'data/about-time.jpg','snippet':'Mine'}]
        scraped=[{'slug':'new-favourite','title':'New Favourite'}, {'slug':'about-time','title':'About Time'}]
        merged=mod.merge_favorites(scraped,existing)
        self.assertEqual(len(merged),1)
        self.assertEqual(merged[0]['page'],'data/about-time.html')
        self.assertEqual(merged[0]['snippet'],'Mine')

    def test_invalid_poster_hosts_rejected(self):
        self.assertTrue(mod.valid_poster_url('https://s.ltrbxd.com/poster.jpg'))
        self.assertFalse(mod.valid_poster_url('https://another.example.com/poster.jpg'))
        self.assertFalse(mod.valid_poster_url('http://s.ltrbxd.com/poster.jpg'))

if __name__=='__main__':unittest.main()
