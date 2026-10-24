# Ibrahim Hussain — portfolio

Static HTML, CSS and JavaScript for the GitHub Pages site at https://ib-hussain.github.io/. Run from this directory with `python3 -m http.server 8000`, then open `http://localhost:8000/`.

The desktop dock links to Contact Me, Photos, Terminal, Resume, Music, Movies, Projects and Bin. The home page has a topo hero, widgets, photo carousel, skills cloud and GitHub metric cards. The four career tracks live under `tracks/`. `about.html`, `experience.html`, `components.html` and `component-lab/` remain available outside the primary dock. `PTCL/` and `fin-glassbox_demo/` are independent content.

`js/projects-data.js` is the original canonical project catalogue. `js/projects-extra.js` supplies seven additional cards; unavailable project images use labelled placeholders. `js/photo-data.js` is the central photo list; its three SVG placeholders are meant to be replaced with Ibrahim's own photographs. `assets/Ibrahim's Resume.pdf` is the canonical résumé; `resume.md` and `resume.html` were cross-checked against it. The terminal reads the project data and résumé markdown instead of maintaining parallel placeholder text.

The music page links to an authorised third-party stream and hosts no audio. `data/films.json` stores public Letterboxd diary entries and the four curated profile favourites as text cards. `data/github.json` holds public metric values. `.github/workflows/data.yml` refreshes both daily and on manual dispatch, committing changed JSON; a failed source retains its prior cache. The initial JSON can show an awaiting-sync state until the first successful workflow run.

Run `python3 tests/check_site.py` for local page structure and links. JavaScript files can be syntax-checked with `node --check`. The existing `.github/workflows/validate.yml` checks the static site on push and pull requests.

Sources adapted from the supplied frontend archive are credited in `CHANGES.md`; review the source component licences before public release. Canvas effects pause on hidden tabs and respect reduced-motion preferences where applicable. The Bin has two full-screen visual sections and a focus-only exit.
