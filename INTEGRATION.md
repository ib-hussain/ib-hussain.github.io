# Movies and Music integration

Extract this archive at the root of `ib-hussain.github.io2` so `src/`, `scripts/`, and `.github/` merge into the existing repository. The homepage and unrelated pages are not replaced.

## Pages

- Film journal: `src/movies/movies.html`
- Four film pages: `src/movies/data/about-time.html`, `casablanca.html`, `frozen.html`, and `babylon.html`
- Listening room: `src/music/music.html`
- Standalone corrected dock preview: `src/navbar.html`
- Root `movies.html` and `music.html` forward existing links to the new paths.

The film pages use local banner and poster images taken from the supplied film captures. The shared dock and Karakoram footer live in `src/css/` and `src/js/`. The four film pages contain the saved pages' factual details and Ibrahim's review, with no sign-in, advertising, availability listings, or public reviews. The main film journal has exactly one Letterboxd link, to the profile. The shader is animated behind the entire journal and does not respond to pointer movement.

## Existing repository files used by the dock and player

The dock points to `src/contact.html`, `src/resume/resume.html`, `src/photos/photos.html`, `src/bash/bash.html`, `src/projects/projects.html`, and `src/bin.html`. If any relocated page uses a different filename, update that dock target in the HTML pages and `src/navbar.html`. The other destinations do not come in this archive.

Music reads your existing `src/assets/audio/gulon-mein-rang-bhare.mp3` and `src/assets/audio/ranjish-hi-sahi.mp3`. These MP3 files were listed in your repository but were not among the supplied attachments, so this archive does not duplicate them. A visible status message reports a missing file if one is absent. The music hero image has been bundled locally. The footer no longer depends on Google Fonts to render.

## Preview and updates

From the repository root, run `python -m http.server 8000`, then open `http://localhost:8000/src/movies/movies.html` and `http://localhost:8000/src/music/music.html`. Opening the journal with `file://` will prevent its JSON fetch.

`python -m unittest discover -s scripts -p 'test_update_movies.py' -v` checks the updater. The existing `.github/workflows/update-movies.yml` runs daily and on manual dispatch. It updates `src/data/films.json` and caches new review posters under `src/movies/data/posters/`; it preserves exactly the four local favourite pages and writes no remote film links into the JSON. The updater's Python environment can use `beautifulsoup4`; the deployed website uses no framework.
