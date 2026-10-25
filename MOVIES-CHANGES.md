# Movies page delivery

Extract this archive at the root of `ib-hussain.github.io2`. It follows the new `src/` layout and does not alter other portfolio pages.

| Path | Purpose |
|---|---|
| `src/movies/movies.html` | Standalone semantic film profile and section links. |
| `src/movies/movies.css` | Letterboxd-inspired dark design, four-column favourites, review list and mobile layout. |
| `src/movies/movies.js` | Loads `../data/films.json`, renders safe text nodes, ratings, hearts, dates, posters and fallback states. |
| `src/movies/tv-shader.js` | WebGL1 fragment shader from the supplied `old-television-shader2.html`, adapted to fill the hero; pauses when hidden and respects reduced motion. |
| `src/movies/data/{about-time,casablanca,frozen,babylon}.jpg` | Four local favourite posters from the supplied movie archive. |
| `src/movies/data/posters/.gitkeep` | Directory for downloaded recent-review posters. |
| `src/media/ib.jpg`, `src/media/favicon.png` | Profile image and favicon matching the existing media paths. |
| `src/data/films.json` | Initial four favourites, screenshot-based stats and three real recent reviews. Future updates replace the RSS-driven reviews. |
| `scripts/update_movies.py` | Public profile/RSS scraper with BeautifulSoup, preservation on partial failure and locally cached posters. |
| `scripts/test_update_movies.py` | Offline parser and failure-handling fixtures. |
| `.github/workflows/update-movies.yml` | Daily and manual data refresh, then a commit when JSON or posters change. |

Run `python -m http.server 8000` from the repository root, then open `http://localhost:8000/src/movies/movies.html`. The page fetches JSON and therefore needs HTTP rather than a `file://` preview. Run `python scripts/test_update_movies.py` for the offline scraper checks. Enable GitHub Actions write permission so the scheduled job can commit.

The local HTML dumps of individual film pages in `src/movies/data/` were left untouched. Their redesigned standalone pages will be made as the raw HTML is supplied one film at a time. Favourite card links currently go to Ibrahim's Letterboxd reviews, then can point to local pages when those exist.

The four profile counts (145 / 114 / 29 / 18), initial favourite ratings and initial review text reflect the supplied screenshots and archive. The first successful scheduled run refreshes public profile figures and the recent review list. If Letterboxd changes its markup or blocks a request, the script keeps the last usable data. Browser layout screenshots could not be generated in this environment; the DOM, asset paths, JSON, JavaScript syntax, HTTP loading and scraper fixtures were checked.
