# Portfolio V2 patch — October 2026

## Installation

This archive is an **overlay/patch, not the complete site**. Extract it at the **root** of the existing `ib-hussain.github.io` repository. The existing assets such as `assets/my-logo.jpg`, `assets/my-display-pic.jpg`, project images and the résumé PDF must remain in place. The patch intentionally does not resend these assets.

From the repository root, first save your current changes in Git or make a backup. Then extract the ZIP into the **repository root**, preserving folders, and overwrite matching files.

For example, with the ZIP copied to your repo directory:

```bash
python -m zipfile -e Ibrahim_Portfolio_v2_patch.zip .
python -m http.server 8000
```

Open http://localhost:8000/ in your browser. Use `git status` and `git diff` to review the patch, then commit only after checking it locally.

## New pages

- `photos.html` — night-sky hero, mixed-size image mosaic, carousel and card stack. Contains one supplied portrait and labelled *illustrative* placeholder art.
- `terminal.html` — safe in-browser Bash-like interpreter with tabs and history, no shell/system execution.
- `resume.html` — long-form web résumé with anchored navigation and link to the existing PDF.
- `music.html` — sculptural hero, Mehdi Hassan selection and *local-only* audio player. No copyrighted songs distributed.
- `movies.html` — CRT-styled hero and an initially empty movie collection. Add only verified entries to `data/films.json`.
- `bin.html` — isolated dark environment, intentionally without site dock/footer.

## Replaced pages

- `index.html` — revised topographic dark hero; seven irregular macOS-style introduction widgets; photos carousel; rotating skill sphere; sourced metric cards; selected projects; dusk/mountains/starfield.
- `projects.html` — themed project cards, filtering, keyboard-open details, animated window modal with all three macOS traffic lights closing the modal.
- `contact.html` — collage, availability gauge, copy button, mail link, dialogue windows.

## Global design and behaviour

- `css/site.css` — dark-only consistent palette, components, fluid layouts and reduced-motion rules.
- `js/site.js` — top fixed macOS dock, supplied circular page icons, tooltips, current-page indicator, hover magnification, global page transitions, project windows, in-browser terminal, carousels and page controls.
- `js/topo.js` — CPU-friendly canvas contour field inspired by the supplied topo TSX interaction model.
- `js/pakistan-ridgeline.js` — dithered **artistic** cross-section of eight Pakistani peaks. Labels are permanently visible; geography is not a literal survey cross-section. Back-to-top control and global footer.
- `js/tom-jerry-cursor.js` — engine adapted from supplied `assets/tom-and-jerry-cursor.html`; preserves the supplied 5.5 chase speed, 36px hitbox and 2200ms fight duration. Disabled with touch/reduced motion and on Bin.
- `assets/favicon.png` — global site icon; `assets/my-logo.jpg` is used only as the detached homepage link.

Home greetings show on new direct visits or explicit reloads. Following internal links to the homepage skips the greetings. Page-to-page transitions use labelled curtains, with a roughly 900ms curved reveal inspired by Aadarshrai's PageLoader transition.

## Honest limitations / external integrations

- The supplied topo background's HTML file is a placeholder; the TSX concept was ported directly to a lightweight canvas, not copied byte-for-byte.
- Several supplied `*2.html` alternatives (e.g. lightbox-grid2) contain only comments. Their layout and interaction ideas have therefore been **adapted**, not misrepresented as exact copies.
- The liquid sculpture, photographic masonry, liquid-gauge and CRT shader effects have portable CSS/JS implementations. They are not GPU shader replicas.
- The globe/skills sphere uses the same spherical/Fibonacci design direction as the supplied Aahana source, adapted to shared site styling.
- Letterboxd does not provide a public user-authorised JSON API for this static implementation; export JSON can populate the film shelf later. No account has been connected.
- Audio playback accepts a file selected by the visitor, with no upload. Music is not packaged or streamed.
- The eight mountain heights follow conventional reported values; some sources differ by one metre. The silhouettes are visual art, not a GIS representation.
- Live deployment, authenticated analytics/monitoring, formal security review, accessibility audits with assistive technology and Core Web Vitals validation remain separate deployment tasks.

## Source credits

- `dev-portfolios/Aadarshrai1801-Portfolio/src/components/PageLoader.jsx` for multi-language curtain and `TransitionContext.jsx` for curved-screen transition concept.
- `assets/tom-and-jerry-cursor.html` for cursor mechanics and artwork.
- `macos-navbar.md` for dock interaction conventions, adapted to the supplied icon assets.
- `@kokonutui/topo-background.tsx`, `metric-card2.html`, `lightbox-grid.tsx`, `lightbox-grid2.html`, `card-stack.tsx` for related interactions/layouts.
- `dev-portfolios/aahana-surya.github.io` for the skills-sphere inspiration.
- Supplied dithered footer reference for artistic dithering; names and peak heights represent mountains in Pakistan.

## Validation

- JavaScript static syntax: `node --check js/site.js`, `node --check js/topo.js`, `node --check js/pakistan-ridgeline.js`, `node --check js/tom-jerry-cursor.js`.
- `python tests/check_v2.py` checks metadata, links, assets, page IDs and project records. It needs BeautifulSoup (`pip install beautifulsoup4`) only for the optional HTML parser; standard-library test fallback is provided.
- Automatic Chromium screenshot checks cannot run in this execution environment because Chromium is under a mandatory browser policy (`URLBlocklist: ["*"]`), blocking local HTTP and file navigation. **Rendering and cross-device interaction need independent local verification.**

## Backup, rollback and release

All changes remain inspectable with `git diff`. To revert this patch safely, use a normal Git revert of its dedicated commit; do not delete existing assets or the old component lab. Deploy to GitHub Pages from the repository's existing configured publishing branch; no CI deployment or telemetry service has been installed by this patch.
