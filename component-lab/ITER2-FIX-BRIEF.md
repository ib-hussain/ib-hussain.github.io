# Iteration 2 fix brief — ib-hussain.github.io

This is the build brief for fixing iteration 2 (PLAN2.md). It replaces CHATGPT-BRIEF.md and
MASTER-PROMPT-COMBINED.md, which planned a from-scratch build and are now outdated — iteration 2
already exists and is being repaired, not rebuilt.

Give this file plus PLAN2.md and ITER2-AUDIT.md to the coding agent (ChatGPT) that has filesystem
access to `D:\Downloads\Repositories\frontend\` and `ib-hussain.github.io\`. Every decision below
was confirmed by Ibrahim directly — do not re-derive or re-guess any of it. Where this brief says
"read `<path>`", that file exists on Ibrahim's machine and must be opened and used as the literal
source, not approximated.

**Ground truth rule**: ITER2-AUDIT.md lists what is currently WRONG, MISSING or PARTIAL against
PLAN2. Treat every row in that audit as a task. This brief resolves every open question the audit
raised. Nothing in this brief should be treated as optional or as inspiration — it is the spec.

**Output format**: one zip of changed/added files, plus `CHANGES.md` (file-by-file diff summary)
and `COMMIT_MESSAGE.txt`. Work page by page; after each page, run `tests/check_site.py` (extend it
for new pages) and take screenshots at 1600×900 and 390×844 before moving to the next page.

---

## 0. Source files confirmed to exist — read directly, do not re-derive

| What | Path |
|---|---|
| Tom & Jerry cursor | `ib-hussain.github.io/assets/tom-and-jerry-cursor.html`, `tom.png`, `jerry.png`, `fight.gif`, `tom-jerry/` folder |
| Favicon | `ib-hussain.github.io/assets/favicon.png` |
| Dock icons | `ib-hussain.github.io/assets/icon-{contactme,photos,terminal,resume,music,movies,projects,bin}.png` |
| Display picture | `ib-hussain.github.io/assets/my-display-pic.jpg` |
| Logo | `ib-hussain.github.io/assets/my-logo.jpg` |
| Resume PDF (canonical) | `ib-hussain.github.io/assets/Ibrahim's Resume.pdf` — **use this one, not** `Ibrahims_Resume_existing.pdf` |
| Resume markdown | `ib-hussain.github.io/resume.md` |
| Project images | `ib-hussain.github.io/assets/{dashboard4,virtualhealth,fin-glassbox1}.png`, `assets/Statistical Analysis.png`, `assets/WritersBlock.png` |
| Echo/bash reference screenshot | `D:\Downloads\Repositories\frontend\assets\echo-hello_world.png` |
| Dock source + styling | `D:\Downloads\Repositories\frontend\macos-navbar.md` — **this is the authoritative dock spec file.** Read it fully before touching `js/site.js` or dock CSS. |
| Mobile navbar (future iteration, not now) | `D:\Downloads\Repositories\frontend\@kokonutui\mobile-navbar2.html` |
| Button presser 2 | `D:\Downloads\Repositories\frontend\@kokonutui\button-presser2.html` |
| Greeting timing reference | `D:\Downloads\Repositories\frontend\dev-portfolios\Aadarshrai1801-Portfolio\` (full repo; also at `github.com/Aadarshrai1801/Portfolio`) — see §1 for the exact mechanism already extracted from this repo |
| Skills planet source | `D:\Downloads\Repositories\frontend\dev-portfolios\aahana-surya.github.io\` (`index.js`, `index-2d.html`) |
| Terminal source | `D:\Downloads\Repositories\frontend\dev-portfolios\akkilaa-portfolio\` (aka `github.com/aahana/aahana-surya.github.io` per Ibrahim — **confirm which repo this actually is before building**; it should be the akkila.dev-style terminal) |
| Fonts (only source to use) | `D:\Downloads\Repositories\frontend\ui.flexnative.com\blocks\` — use only fonts found here, nowhere else |
| Color palette seed | `D:\Downloads\Repositories\frontend\dev-portfolios\aahana-surya.github.io\` — use this repo's palette as the starting dark palette (Ibrahim will tune it in a later iteration) |
| Old-television shader | already in this environment at `old-television-shader.html` (WebGL1, no deps — see implementation notes below) — port as-is for the Movies hero |
| Button presser (fallback, non-"2") | already in this environment at `button-presser.html` — only use if `button-presser2.html` is somehow unusable |
| Lightbox grid (fallback, non-"2") | already in this environment at `lightbox-grid.html` — use for ratios/sizing reference if `lightbox-grid2` needs a fallback, but prefer `lightbox-grid2.html` (confirmed to exist on Ibrahim's machine — location not given here, search `D:\Downloads\Repositories\frontend\@kokonutui\`) |

If any path above is wrong or missing when the coder actually looks, **stop and ask Ibrahim** rather
than substituting a guess — this has gone wrong before (see ITER2-AUDIT.md).

---

## 1. Greeting (startup loader) — exact mechanism

Source: `TransitionContext.jsx` and `PageLoader.jsx` in Aadarshrai1801/Portfolio. This is a React
app; port the *timing and curve math*, not the React/GSAP machinery, into vanilla JS.

### 1.1 Words and order (already decided, keep as-is — do not use Aadarshrai's word list)
Three greeting words, each shown then replaced: **Hello!**, **`!السلام علیکم`** (Urdu, exactly this
string — exclamation mark at the **start**, per PLAN1, not PLAN2's "السلام علیکم!"), **Ciao!**.
After the third word, the typed line `echo "hello world"` plays with a blinking block cursor
(reference image: `assets/echo-hello_world.png`), full length — **do not cap the loader at 1
second**; let total duration equal whatever the ported timing produces.

### 1.2 Timing, ported from `runWelcomeSequence()` in TransitionContext.jsx
For each of the first N-1 greeting words (non-last): fade in over **110ms**, hold at full opacity
until **120ms** elapsed, fade out over **50ms**, then hide (total ~170ms visible per word). For the
**last** greeting word (here: the typed echo line is the equivalent of the "last" word): hold for
**300ms** after it finishes typing, then proceed to reveal.

### 1.3 Reveal animation, ported from `collapseLoaderInU()`
A 900ms clip-path "U-curtain" reveal: the loader screen's bottom edge rises via a cubic-ease-out
curve (`eased = 1 - (1-t)^3`) combined with a sine-based "depth" factor
(`curveFactor = sin(t * PI)`, `depth = min(screenWidth*0.35, screenHeight*0.45)`,
`currentDepth = depth*(0.35+0.65*curveFactor)`), producing a curved polygon clip-path that sweeps
up and off-screen over 900ms via `requestAnimationFrame`. Port the `step()` function's math
directly (see TransitionContext.jsx lines 46–102 in the cloned repo) — this is the only part of
the loader visual language with real math behind it; replicate it exactly rather than approximating
with a CSS transition.

### 1.4 Per-page transition (every page, not just index — confirmed)
On navigating to any page, before the destination page content is shown: cover the screen with the
same U-curve (`coverScreenInU()`, 650ms) while fading in the destination page's name (e.g. "Photos",
"Terminal") using the same word, then after navigation, run the 900ms reveal (`collapseLoaderInU()`)
again. On a **fresh load / reload of a non-index page** (not a client-side nav), use the shorter
`playSubpageAnimation()` path: show the page name immediately, hold 260ms, then run the 900ms
reveal. Only the index page on fresh load/reload runs the full three-greeting + echo sequence
(§1.1–1.2); every other page (fresh load or navigation) shows only its own name once.

A visit from an external link (not internal nav) counts as a fresh load and triggers this same
page-name-once sequence, not the three-greeting sequence (that's index-only).

---

## 2. Cursor (Tom & Jerry)

- Port `assets/tom-and-jerry-cursor.html` as the global custom cursor on every page.
- Hides the native OS cursor **only on pointer (mouse/trackpad) devices** — detect with
  `matchMedia('(pointer: fine)')` or similar; touch devices keep native touch behavior (no custom
  cursor, no hidden native cursor).
- Preserve whichever animation states already exist in the supplied HTML file (e.g. a "chasing"
  state while a page/loader is active vs. a resting/idle state once loaded) — read the file to see
  what states it defines and wire them to the site's loading/loaded states. If the file has no
  distinct loading-state animation already, add a simple state toggle (`.cursor--loading` /
  `.cursor--idle`) driven by `document.body.classList.contains('loading')`.
- `prefers-reduced-motion: reduce` → static (non-animated) cursor image, not hidden.
- Delete `assets/peter-cursor.svg` and all references to it (`js/site.js` line ~55 and CSS).

---

## 3. Theme — dark only, no toggle

- Delete the PullCord lamp component (`js/lamp-component.js`, and the wiring in `js/site.js` lines
  ~7–12) entirely.
- Delete `vendor/theme-changer2.html` (unused already) and any light-mode CSS tokens in
  `css/tokens.css` — dark is the only palette, permanently, not just via `prefers-color-scheme`.
- The top-right corner where the theme control used to sit stays **empty** — no replacement element.
- Favicon (`assets/favicon.png`) is used in: (a) the browser tab `<link rel="icon">` on every page,
  and (b) the site header — i.e. there should be a visible favicon-based mark in the header in
  addition to the top-left `my-logo.jpg` circle. Confirm placement doesn't collide with the logo
  circle; if it would, put the favicon mark small and separate (e.g. inline with page title) rather
  than skip it.

---

## 4. Hero/background treatment (index-specific but sets the pattern)

Inspiration reference: `https://portfolio-mti1.vercel.app/` — after the hero/top section, the next
section **fully replaces** the hero (not layered/overlaid) and then occupies the whole viewport
before the following section does the same. Build the index page's section transitions this way:
each major section (hero → widgets → photos-essence → skills-planet → metric card) should feel like
a full takeover, not a scroll-reveal-on-top-of-hero. The topo background (`@kokonutui/topo-background`
or `topo-background2` — use whichever exists; audit notes `topo-background2` may not exist, check
`D:\Downloads\Repositories\frontend\@kokonutui\` first) is the **hero section only**, and because the
whole site is permanently dark, the topo background renders in its dark variant always — there is
no second "mountains and stars" state to switch to on scroll (this supersedes earlier PLAN2 language
about a second hero state; confirmed by Ibrahim in §3.20).

---

## 5. Dock

**Primary source for all dock behavior and styling: `D:\Downloads\Repositories\frontend\macos-navbar.md`.**
Read this file fully before writing any dock code — it is the authoritative spec, not PLAN2's prose
description.

- Desktop only. **No dock on mobile** — mobile uses `@kokonutui/mobile-navbar2.html` instead, but
  mobile is explicitly **out of scope for this iteration**. Don't build the mobile navbar now; just
  don't break mobile worse than it already is, and don't try to make the desktop dock responsive
  down to phone width.
- Always pinned at the top (not "top only after scrolling" — this is the PLAN1 behavior currently
  in the repo and must change).
- Labels and order, exactly: **Contact Me, Photos, Terminal, Resume, Music, Movies, Projects, Bin.**
- Icons: use `assets/icon-*.png` directly as supplied — they are already finished circular icons,
  do not re-mask or re-crop them.
- Press effect: use the exact press/hover/magnification behavior defined in `macos-navbar.md` — do
  not invent a different interaction.
- Active-page dot: sits **below** the icon, always (this fixes the audit's suspected WRONG — the
  current CSS rule that flips the dot above the icon when the dock is "at top" must be removed,
  since the dock is now always "at top").
- Dock hides when the footer's top edge reaches the bottom of the viewport (i.e. footer fully
  visible — footer is now pinned to the absolute bottom of the page per §7), and reappears
  immediately on scroll-up. **Exception: no dock at all on the Bin page** (Bin has no navbar per
  PLAN2 — it's a "desolate" page).
- Remove the dock entirely from `about.html`, `experience.html`, `components.html` navigation (the
  files stay in the repo, just unlinked — see §11).

---

## 6. Index page

Rebuild in this exact section order (replaces the current hero → proof → disciplines → featured →
skills → next order, which is wrong):

1. **Hero** — topo background (dark, permanent — see §4), no headline text over it.
2. **Up to 7 macOS-style widgets**, laid out with the sizes/ratios taken from
   `@kokonutui/lightbox-grid2.html` (confirmed source for widget sizing). Widget placement can be
   arbitrary for this iteration — Ibrahim will rearrange in the next pass. Requirements:
   - No hover effects, no click behavior — purely static display widgets.
   - One widget must be a **tall portrait** widget holding `assets/my-display-pic.jpg` (the photo is
     portrait orientation, so the widget container must match that aspect ratio, not force it into a
     square/landscape crop).
   - Content: intro, "who I am", skills, interests — draft the actual text yourself from
     `resume.md` and the project files in the repo (don't ask Ibrahim to write it; he said to write
     it and he'll fix it next iteration).
   - Fold the removed "proof" section's content (77%+ accuracy claim, Teradata pipeline, SmartForum
     internship) into the intro widget's text rather than dropping it.
   - The four "track" widgets (Quant, ML/AI, Engineering, Analytics — see §13 Career layer) should
     be included as up to 4 of these widgets, OR placed on the Projects page instead — put them
     wherever fits visually once the layout is drafted; both locations are acceptable, pick one and
     be consistent.
3. **Metric card** — up to 5 side-by-side stat tiles/charts, built from public GitHub stats via a
   GitHub Action (see §14 for the workflow). Choose whichever ~5 metrics best fit the site's vibe
   (e.g. commits/month, top languages, repo count, longest streak, contribution graph) — your
   judgment call on which 5.
4. **Skills planet** — copy the aahana-surya planet implementation **exactly** (`index.js`,
   `index-2d.html`), including all the tools/skills it currently lists. Do not curate or trim the
   skill list — Ibrahim will customize it himself afterward. Just get the working planet in place
   with its full existing content.
5. **Photos essence carousel** — `shadcn/@reui/c-carousel-9.html`, populated with placeholder nature
   photos or the repo's existing photo assets (`pictures/`) — doesn't matter which, Ibrahim will
   swap URLs later. Just get all items wired to one easily-editable list of image paths.

Remove entirely: the "proof" metrics-looking section as a standalone block (content merged into
widget per above), the "Four ways to think" track cards (superseded by widgets/track pages), the
"featured projects" section (Projects page covers this), the closing "Let's build something useful"
CTA section.

---

## 7. Footer

- **Placement: fixed at the absolute bottom of the page** (PLAN1 behavior) — only fully visible once
  the user scrolls all the way down, not inline at the end of `<main>` like the current build.
- Ridgeline peaks: keep the 3 already decided — **Nanga Parbat 8,126 m, K2 8,611 m, Rakaposhi
  7,788 m** — do not add more; this is final (Ibrahim confirmed no additional peaks needed).
- Hover: single readout that follows the cursor's x-position across the ridgeline (not one label
  per peak) — this reuses the **existing tooltip mechanic already built** for height display; keep
  that dynamic cursor-tracking tooltip, just populate it with the peak name + height at whatever
  x-position the cursor sits over.
- Remove: the "© ... Built with HTML / CSS / JS" copyright line (`js/site.js` line ~28), the
  "Explore" and "Find me" footer columns, and the tagline "Building intelligent systems, one
  experiment at a time." — all being redesigned away.
- Back-to-top button: keep on **every page except Bin** (circular, arrow-up, pressed hover state,
  "Back to top" tooltip — already implemented, just extend it to the pages that are missing it:
  currently on 6 of the pages, needs to be on all non-Bin pages once Photos/Terminal/Music/Movies
  exist).

---

## 8. Projects page + project window cards

- Projects shown: **all projects currently in `js/projects-data.js` / PLAN2's project list** — every
  one of them appears, nothing is cut.
- Hero: `halftone-background2` (confirmed, matches current build — keep).
- Cards use `lightbox-grid2` layout (confirmed source location needed — search
  `D:\Downloads\Repositories\frontend\@kokonutui\`).
- Window content (on card click): use all fields already in `js/projects-data.js` with their
  existing data — title, summary, role, stack, links, images, year. The data is correct as-is;
  don't invent new fields.
- Tech tags: all tags currently shown (PyTorch, FinBERT, GNN, Vision Transformer, DCT, Flask,
  PostgreSQL, Supabase) are **confirmed correct** — keep them. In addition, **add any other
  accurate skill/technology associated with Ibrahim that you can infer from the repo's project
  files, resume.md, or READMEs** — err on the side of adding rather than omitting, since these are
  easy for Ibrahim to delete later but harder for him to notice are missing. Just make sure nothing
  added is fabricated — base additions on what the project's actual code/README shows.
- Fin-Glassbox description: keep the existing wording — "market and news representations, risk
  modelling and fusion constraints."
- DeepDocForgery and MobileInfoAnalytics: no real screenshots available. Use a clearly-labeled
  placeholder image, and add an HTML comment in the source (e.g.
  `<!-- PLACEHOLDER IMAGE — replace with real screenshot -->`) right at that image tag so Ibrahim
  can find and swap it easily.
- "Technical overview ↗" links: **remove any that point to `#` or don't resolve to a real, live
  URL.** Keep only links that go somewhere real (e.g. an actual GitHub repo, a live demo). Check
  each one.
- **All three window buttons (red/yellow/green) close the window**, each with the **reverse of the
  open animation** (same spring curve, ~300ms, played backward) rather than the current mixed
  behavior (instant hide / minimize / dialog-open). Opening: the window should animate outward from
  the clicked card's position with a spring (matching whatever spring easing the lightbox/dialog
  components already use elsewhere in the site).

---

## 9. Contact page

- Email address (confirmed, use exactly): **ibrahimbeaconarion@gmail.com**
- Hero: `hero-04-art-collage`.
- Components to add, with creative freedom on exact copy/labels since Ibrahim has no fixed vision
  yet — just get them functioning and visually present, he'll iterate once he sees them in use:
  - `liquid-gauge2` — pick any meaningful value to visualize (e.g. "response time", "projects
    shipped", "coffee consumed" — your call, make it fun/on-brand).
  - `button-presser2.html` (confirmed to exist at
    `D:\Downloads\Repositories\frontend\@kokonutui\button-presser2.html`) — wire it to something
    useful, e.g. "copy email" or "send message."
  - Dialogs 01 and 03 from `blocks.so` — use for whatever makes sense (e.g. a confirmation dialog
    after the button-presser action, or an expanded contact-methods dialog). Your creative call.
- Contact mechanism: `mailto:` link plus a copy-email-to-clipboard button (the button-presser can
  trigger this) — default approach, no form backend needed.

---

## 10. Photos page

- Hero/feature blocks: `hero-12`, `hero-04`, `feature-03`, `content-02`, in that order, then the
  footer.
- **Replace the template copy in each block with real written text** about Ibrahim/his photography
  interest — draft it yourself from what's known about him (resume.md, profile). If you genuinely
  can't produce something better than the placeholder template text for a given block, leave that
  block's text as-is rather than writing something worse.
- Additional components — `card-stack`, `button-presser2`, `lightbox-grid` (standalone, for photo
  display), `liquid-gauge2` — placed after `content-02`, before the footer.
- Photo content: build the gallery to support **both** a "with captions" view and a "without
  captions" toggle/variant, so Ibrahim can compare which he prefers. Populate with placeholder
  nature photos or existing `pictures/` assets — he'll swap URLs later; just make the image list
  trivially editable (one array/JSON of paths + captions).

---

## 11. Terminal page

- **No tabs, no navbar on this page at all** — just a single full-page terminal, adopting the visual
  style from `D:\Downloads\Repositories\frontend\dev-portfolios\akkilaa-portfolio\` directly (this
  supersedes PLAN2's "tabs are pages" description — Ibrahim cut that idea).
- Commands: inspect what's implemented in the akkilaa-portfolio source and port the same command
  set and behavior (e.g. `help`, `about`, `projects`, `resume`, `contact`, `clear`, etc. — whatever
  that repo actually defines; don't invent commands not present there).
- Terminal commands should read **real site content** — e.g. a `projects` command lists actual
  project names/links from `js/projects-data.js`, a `resume` command surfaces real resume info from
  `resume.md` — not static placeholder text.
- Prompt username: build so that **any of the three** confirmed usernames
  (`ib_hussain@archlinux`, `ib-hussain`, `ib_hussain`) can be used — pick one as the default prompt
  text (your call), since all three are approved for use anywhere on the site.

---

## 12. Resume page

- Content comes from `resume.md` as the structural/section source, cross-checked against
  `assets/Ibrahim's Resume.pdf` (the canonical complete CV) — **the PDF is authoritative; if
  `resume.md` and the PDF disagree on any fact, fix `resume.md` to match the PDF.**
- Sections: whatever the PDF's actual structure is (likely Experience, Education, Projects, Skills,
  Certifications — confirm against the actual PDF content, don't assume).
- Use `scroll-index2` to render this as a scrollable page (confirmed requirement, currently missing
  — this is the core fix for this page).
- Keep the PDF download link pointing at `assets/Ibrahim's Resume.pdf`.

---

## 13. Music page

- Hero: `liquid-sculpture-hero` (Component2), **with text content** — a short caption/intro (your
  call on exact wording, keep it brief).
- Song: **"Gulon Mein Rang Bhare"** (confirmed — Ibrahim will add more Mehdi Hassan songs later; for
  now just this one).
- **No audio files are available and there is no confirmed right to host any.** Do not embed audio.
  Instead, link out to this song on a streaming platform (e.g. YouTube/Spotify — pick whichever is
  easiest to embed/link cleanly). Leave an HTML comment noting this is a placeholder link pending
  Ibrahim's decision on hosting/rights, so it's easy to find and revisit.

---

## 14. Movies page

- Hero: `old-television-shader` (ported source already available in this environment, WebGL1,
  self-contained — see the component list in §0), **with a small amount of text content** over/near
  it (your call on exact wording — a short line, not a full headline).
- Letterboxd profile: **`https://letterboxd.com/ib_hussain_/`** (confirmed).
- Data pipeline: GitHub Action reads the public RSS feed at
  `https://letterboxd.com/ib_hussain_/rss/` into `data/films.json` (approved — build this as part of
  the data workflow in §14... see §16 below for the Action itself).
- "Top movies": Ibrahim's own curated list from his profile (not auto-derived from the diary) — pull
  whatever his profile currently surfaces as top/favorite films, or if that's not scriptable from
  RSS alone, use the most recent 5★-rated entries from the diary feed as a reasonable proxy.
- Reviews: pulled automatically from the Letterboxd diary/RSS feed (not hand-written).
- Posters: **text cards only** — do not hotlink poster images from Letterboxd.

---

## 15. Bin page

- Two full-viewport background sections stacked so scrolling reveals both: **flow-field-background
  at the top, wave-background at the bottom** (confirmed order).
- No navbar, no dock, no footer on this page (desolate page, per PLAN2 — confirmed in §5).
- Visually, a "treacherous dark place with no escape" — visuals-only, no real content.
- Keyboard-accessible exit: a visually-hidden link/button that becomes visible **only on keyboard
  focus** (e.g. `sr-only` until `:focus`), linking back to the index page — confirmed, build this
  for accessibility compliance even though it's visually absent otherwise.

---

## 16. Career layer (in scope for this iteration — confirmed, not deferred)

- **Positioning line**: "Quantitative Data Scientist | Systems Modelling | Risk & Decision
  Analytics" — approved, use as-is.
- **Status line**: "Data Science undergraduate, FAST-NU, graduating 2027, seeking Summer 2027
  internships; open to relocation in Europe and the UK" — approved, use as-is.
- **Four track pages**: `tracks/quant.html`, `tracks/ml-ai.html`, `tracks/engineering.html`,
  `tracks/analytics.html` — build these, not linked from the dock, linked from the footer. Also
  surface them as widgets either on the Projects page or in the index's widget grid (§6, your
  placement call — pick one location).
- JSON-LD structured data, `llms.txt`, `robots.txt`, `sitemap.xml`, `resume.md` — all in scope,
  include/update them (`robots.txt` and `sitemap.xml` already exist in the repo root — extend them
  to cover the new pages: photos.html, terminal.html, music.html, movies.html, bin.html,
  tracks/*.html).

---

## 17. GitHub Actions / data workflow

- Add `.github/workflows/data.yml` (alongside the existing `validate.yml`) that:
  - Fetches public GitHub stats (for the index metric card, §6.3) and writes them to a JSON file
    under `data/`.
  - Fetches the Letterboxd RSS feed (`https://letterboxd.com/ib_hussain_/rss/`) and writes
    `data/films.json` (§14).
  - Runs on a schedule (e.g. daily) plus manual dispatch.
- This is additive — don't touch `validate.yml`.

---

## 18. Repo cleanup / navigation

- **Keep these files in the repo, unlinked from the dock** (removed from nav only, not deleted):
  `about.html`, `experience.html`, `components.html`.
- **Keep `PTCL/` and `fin-glassbox_demo/` exactly as they are** — they serve other purposes, nothing
  in the site links to them, don't touch them.
- **Keep `component-lab/`** in the repo, outside navigation (reference/testing area).
- `navbar.html`, `footer.html`, `linkedinBanner.html` — keep as-is (component source files, not
  pages).

---

## 19. Verification

After each page is built: run `tests/check_site.py` (extend it to cover photos/terminal/music/
movies/bin and the new dock labels/links), take screenshots at 1600×900 and 390×844, and check off
that page's rows in ITER2-AUDIT.md as resolved. Do not batch all pages into one final check — verify
incrementally, per page, as this brief's process section specifies.

Final deliverable: a zip of all changed/added files + `CHANGES.md` + `COMMIT_MESSAGE.txt`.

---

## 20. Anything still unresolved

Nothing in this brief is a placeholder for a future question — every item above has a confirmed
answer from Ibrahim. The only things explicitly deferred to a later iteration are: the mobile dock/
navbar (§5), and further customization of the skills planet, color palette, and index widget layout
(Ibrahim will adjust these himself post-build). If the coding agent hits a path in §0 that doesn't
actually exist when checked, stop and report back rather than substituting something — that exact
failure mode (assuming instead of asking) is what went wrong in iteration 2 the first time.
