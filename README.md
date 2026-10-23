# Ibrahim Hussain — Portfolio Draft v1

A complete draft multi-page portfolio built with **static HTML, CSS and vanilla JavaScript**. No React, bundler, npm install or runtime API required. **This is a draft for review, not a deployed site.**

## Run locally

From the folder containing `index.html`:

```bash
python -m http.server 8000
```

Visit `http://localhost:8000/`. Opening `index.html` directly from disk is possible for basic inspection, but a local HTTP server is recommended for consistent history and asset loading.

## Pages

| File | What it contains |
|---|---|
| `index.html` | Three-language welcome, native halftone background, summary metrics, four career tracks, project cards, draggable skills globe |
| `projects.html` | Filterable project catalogue, interactive macOS project windows, modal details |
| `experience.html` | Reverse-chronological timeline, PTCL / SmartForum (unverified dates flagged) / volunteer work |
| `about.html` | Profile, portrait and academic background |
| `contact.html` | Direct email, LinkedIn and GitHub navigation (no server-side form) |
| `components.html` | Links to live adaptations, original files and isolated component lab |
| `component-lab/index.html` | The previous 31-demo framework-free UI catalogue with TSX-aligned source HTML names |

## Source reuse and faithful ports

- `dev-portfolios/Aadarshrai1801-Portfolio/src/components/PageLoader.jsx` → 3 greetings, rapid cycling, rounded-up exit. We changed the languages and added a terminal typewriter; they remain a **custom port**, not a literal React transplant.
- `@kokonutui/halftone-background2.html` → mounted as a full-viewport background behind Home with original procedural canvas code.
- `@kokonutui/theme-changer2.html` → original simulation mounted at small scale as a top-right control; the surrounding control also toggles the theme via pointer or keyboard.
- `21st.dev/@kedhareswer/components/ridgeline-dither-footer/Component2.html` → original canvas ridgeline, palettes, noise and dithering code; mounted with bespoke links/text.
- `dev-portfolios/aahana-surya.github.io/index.html` → original Fibonacci-sphere mathematics and pointer mechanics adapted to Ibrahim's skills.
- `macos-navbar.md` → dock with glass background and hover magnification, plus requested scroll-triggered top flip and tooltips.
- `my-logo.jpg`, `my-display-pic.jpg` → supplied image assets; prior portfolio images used in several project cards.
- `@kokonutui/morphic-navbar.tsx` → concept applied to detached floating controls, not a literal replication of its complex morphic choreography.
- `component-lab/updated-source-previews/` → nonempty `*2.html` alternatives preserved; empty files were not treated as finished.

The Peter Griffin cursor uses a **self-contained stylised SVG proxy** rather than an exact licensed Peter Griffin sprite or animated original frames. Running is currently expressed via a bounce/tilt while a click or navigation is in progress. It is disabled for reduced-motion preferences and touch. Replace with a cleared/licensed original asset if exact visual parity is required before public deployment.

Other user-provided reference portfolios informed the experimental direction but no unavailable source implementation was invented. Third-party component source licences and credits must be checked before publishing copied work.

## Design and behaviour

- Designed and visually inspected at **1600×900** and **390×844**, with max-width and narrow-device styles.
- The macOS dock starts at the bottom, moves to the top after one dock-width of scrolling, reverses the hover enlargement direction and hides when the footer enters most of the viewport.
- Intro sequence starts on direct visits or reloads of Home; returning from another internal page skips it. Begins transitioning away after 1000 ms, with the exit motion taking additional time.
- Cards: red hides with a restore control, amber minimises/restores, green opens project details. Normal project links open GitHub; all content is present in HTML for crawlability.
- Theme persists in localStorage when available. Native fallback fonts and bundled images support offline demonstrations.
- The separate component lab may use remote images/fonts; the six core portfolio pages do not use third-party scripts.

## Test and deployment

Run `python tests/check_site.py`; JavaScript syntax can be tested with `node --check js/*.js` individually. GitHub Actions workflow `.github/workflows/validate.yml` runs these on push and pull request. Review the browser viewport snapshots and perform manual keyboard, screen-reader and performance tests before approving deployment.

To deploy, create a separate branch/repository or use GitHub Pages pointing to the website root; do not overwrite the existing live portfolio without review and backup. `.nojekyll` is included for static hosting. Canonicals and sitemap currently assume the production URL `https://ib-hussain.github.io`.

To take a local backup: `python scripts/backup.py`. To verify/restore: `python scripts/restore.py backups/<snapshot>.zip /path/to/new-empty-folder`. Backups are checksum-verified and are not included in the public ZIP by default.

No automatic analytics or server-side logging is bundled. This is deliberate for privacy and because static GitHub Pages has no native application backend. For production monitoring, configure GitHub Pages deployment status and an external uptime monitor after domain activation; performance can be audited with Lighthouse / Web Vitals. Do not claim those external services are connected already.

## Needs review before publishing

1. SmartForum internship dates/outcomes; exact repository links for projects that currently link to the generic GitHub profile.
2. Current PDF résumé is copied from an older upload; compare dates/claims with `resume.md`.
3. Verify project outcomes and avoid inferring deployment readiness from research prototypes.
4. Replace temporary stylised cursor artwork if an exact, licensed Peter Griffin sprite is needed.
5. Confirm licences/attribution for the third-party reusable components before public deployment.
6. Accessibility audit with assistive technology, colour-contrast measurement and performance optimisation of concurrently running canvas effects.

## File convention

Keep original TSX-related test previews under `component-lab/`. For user-supplied `*2.html` versions, the nonempty version is preserved under `component-lab/updated-source-previews/` without destroying an earlier working alternative. The production website uses the explicitly named `*2.html` files above for halftone, theme changer and ridgeline.
