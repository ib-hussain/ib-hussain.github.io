# Iteration 2 repair — changed files

Apply this archive at the root of `ib-hussain.github.io`. The archive contains changed and added files only. **Zip extraction cannot delete old files:** after extracting, run `git rm assets/peter-cursor.svg css/lamp-component.css css/tokens.css js/lamp-component.js vendor/theme-changer2.html` in the repository before committing. Those files are unused by the repaired site. Keep `PTCL/`, `fin-glassbox_demo/`, `component-lab/`, `navbar.html`, `footer.html` and `linkedinBanner.html` untouched.

| File | Change |
|---|---|
| `index.html` | Topo hero; seven widgets, five metrics, complete Aahana skills list and photo carousel. |
| `contact.html` | Collage, direct contact controls, gauge, tear button and dialogs. |
| `photos.html` | Requested four content blocks, gallery, caption comparison, stack and lightbox. |
| `terminal.html` | Full-screen single terminal without tabs or dock. |
| `resume.html` | PDF-grounded continuous résumé with sticky scroll index and canonical PDF link. |
| `music.html` | Liquid sculpture hero and a single outbound song link. |
| `movies.html` | WebGL television shader, verified profile favourites and feed-driven diary cards. |
| `projects.html` | Halftone hero, filterable project grid and detail window. |
| `bin.html` | Two full-screen visual environments and focus-only home exit. |
| `about.html`, `experience.html`, `components.html` | Shared dock, transition, footer and metadata integration; remain outside primary navigation. |
| `tracks/quant.html`, `tracks/ml-ai.html`, `tracks/engineering.html`, `tracks/analytics.html` | Four career track pages with relevant cases and résumé links. |
| `js/site.js` | Eight-icon desktop dock, page transitions and exact greeting sequence. |
| `js/pakistan-ridgeline.js` | Three named peaks, following tooltip, footer career links and back-to-top. |
| `js/tom-jerry-cursor.js` | Source cursor behavior, loading state, reduced-motion static state and track-relative asset paths. |
| `js/abyss.js` | Source-adapted flow particles and wave field, respecting reduced motion. |
| `js/skills-planet.js` | Aahana's Fibonacci sphere, perspective and category interaction. |
| `js/photo-data.js` | One editable list of photo paths and captions. |
| `js/index-page.js` | Carousel and public GitHub metric binding. |
| `js/projects-extra.js` | Seven additional project cases, with unverified URLs withheld. |
| `js/projects-page.js` | Project filters, full dialog details, spring open and reverse close. |
| `js/contact-page.js`, `js/button-presser.js`, `js/liquid-gauge.js` | Contact dialogs, copied address, source-based tear button and gauge. |
| `js/photos-page.js` | Gallery/lightbox, caption toggle, stack and supporting components. |
| `js/terminal-page.js` | Command UI using original project data and résumé markdown. |
| `js/resume-page.js` | Active section index and reading progress. |
| `js/liquid-sculpture.js` | Supplied Component2 WebGL2 engine adapted to a local sculpture SVG. |
| `js/tv-shader.js` | Supplied WebGL1 old television shader port. |
| `js/movies-page.js` | Safe text-card rendering of the RSS JSON feed. |
| `css/iteration2.css` | Page and global layouts, dark palette, dock/footer and responsive rules. |
| `css/component-adaptations.css` | Contact/photo interaction styling from supplied components. |
| `css/liquid-sculpture.css` | Scoped source Component2 hero styling. |
| `assets/sculpture-dark.svg` | Local image supplied with the frontend sculpture source. |
| `assets/tom-and-jerry-cursor.html` | Exact cursor demo copied from `frontend(4).zip`. |
| `assets/placeholders/karakoram-dusk.svg`, `starlight.svg`, `blue-hour.svg` | Clearly labelled temporary nature illustrations. |
| `assets/placeholders/project-card.svg` | Clearly labelled project-card placeholder. |
| `data/github.json` | Initial metrics cache, awaiting the first workflow run. |
| `data/films.json` | Confirmed profile and four curated favourites; feed cache starts empty. |
| `scripts/update_public_data.py` | Public GitHub metrics and Letterboxd RSS parser. |
| `.github/workflows/data.yml` | Daily/manual refresh and commit of changed JSON. |
| `tests/check_site.py` | Sixteen-page link and structural checks, dock/order and Bin constraints. |
| `tests/test_public_data.py` | RSS and GitHub response fixtures. |
| `resume.md` | Canonical PDF facts and approved career positioning/status. |
| `llms.txt`, `sitemap.xml` | Updated pages, tracks and career metadata. |
| `README.md` | Current setup, source and data-flow notes. |
| `ITER2-AUDIT-RESOLUTION.md` | Row-by-row resolution against the supplied audit. |
| `COMMIT_MESSAGE.txt` | Suggested commit subject. |

**Source notes.** The terminal source in `frontend(4).zip` had no reusable command implementation, so the existing terminal command pattern was adapted to real site data. The music link is an outbound YouTube recording; an HTML comment marks the hosting/rights decision point. Letterboxd favourites were verified from the public profile on 24 October 2026; reviews come from the scheduled RSS parser rather than fabricated copy. Component adaptations should be checked for their original licences before publishing.

**Verification.** `python3 tests/check_site.py` passes 16 pages; all `js/*.js` files pass `node --check`; `python3 tests/test_public_data.py` passes two fixtures. Browser screenshots at 1600×900 and 390×844 remain outstanding because no local browser executable is available and the cloud browser cannot reach the local server. Review visual layout and transitions before merging. The first GitHub Action run needs repository Actions write access to commit its JSON updates.
