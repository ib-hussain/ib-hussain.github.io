# Iteration 2 audit against PLAN2.md

Repo: ib-hussain/ib-hussain.github.io, commit b0b8f42 ("firstbad draft ...").
Method: every PLAN2 requirement checked against the committed files (grep, sed, CSS and JS reads). Evidence is given as file and line or the search result.
Status key: DONE (matches), PARTIAL (exists, differs in detail), WRONG (exists, contradicts PLAN2), MISSING (absent).

## A. Global

| # | PLAN2 requirement | Status | Evidence |
|---|---|---|---|
| A1 | Startup greeting: Hello / Urdu / Ciao, typed `echo "hello world"`, block cursor, leaves after a set time | PARTIAL | index.html #page-loader has all three greetings and .bash-prompt. site.js 38-53 types the command, greetings change at 0/270/540 ms and the loader leaves at 1000 ms. The timings are hard-coded with a comment saying "Reference animation: PageLoader.jsx", but PageLoader.jsx is not in the repo, so they are unverified. |
| A2 | Per-page transition ("shows Work first, then the page") | MISSING | No per-page loader on any page other than index. |
| A3 | Urdu greeting text | PARTIAL | index.html renders "السلام علیکم!" with the exclamation mark at the end. PLAN1 wrote "!السلام علیکم". Needs a decision (see Q-list). |
| A4 | Global cursor = `assets/tom-and-jerry-cursor.html`, preset values | WRONG | site.js 55 says "Peter Griffin inspired SVG cursor"; uses assets/peter-cursor.svg. `assets/tom-and-jerry-cursor.html` is not in the repo. |
| A5 | Favicon = `assets/favicon.png` on every page | WRONG | index.html: `<link rel="icon" type="image/jpeg" href="assets/my-logo.jpg">`. Six pages use this. Only one page uses `pictures/favicon.png`. `assets/favicon.png` does not exist in the repo. |
| A6 | Top-left logo, full circle, my-logo.jpg, returns home | DONE | index.html .brand-orb links to index.html with assets/my-logo.jpg. |
| A7 | Top-right theme button = `@kokonutui/theme-changer2.html`, with its animation | WRONG | The control is a "PullCord" lamp (lamp-component.js, site.js 7-9). theme-changer2 is in vendor/ and component-lab/ but unused. |
| A8 | Dock always at the top | WRONG | site.js 32-35: `atTop = scrollY >= dockWidth`, so the dock moves to the top only after scrolling. css `.dock{bottom:21px}` is the default. This is PLAN1's behaviour. |
| A9 | Dock labels: Contact Me, Photos, Terminal, Resume, Music, Movies, Projects, Bin | WRONG | index.html dock: Home, Projects, Experience, Skills, About, Contact, Component Lab. Only "Projects" matches. |
| A10 | Dock icons = circles built from `assets/icon-*.png` | WRONG | Inline SVG line icons. `assets/icon-*.png` are absent from the repo. |
| A11 | Dock hover: magnification flips direction, tooltip flips below | PARTIAL | css `.dock.top` rules exist. Not verified in a browser. |
| A12 | Dock press effect on click | MISSING | No press rule found in css/site.css. Not verified. |
| A13 | Active page indicated by a dot under the icon, also when the dock is at the top | WRONG (probable) | site.js/CSS: `.dock-item[data-current="true"]:after{bottom:auto;top:-5px}` places the dot ABOVE the icon, and this rule is the one applied at top. PLAN2 says the dot must stay below. Needs a browser check. |
| A14 | Dock hidden when the footer is fully visible, back on scroll-up | PARTIAL | site.js 35 sets `is-hidden` when the footer top is within 60% of the viewport. Logic exists, not browser-tested. |
| A15 | Footer = Pakistan mountain ridgeline with named peaks and heights (Nanga Parbat 8,126 m, K2 8,611 m, Rakaposhi 7,788 m, plus five more) | MISSING | `grep Nanga|Rakaposhi` across the repo returns nothing. The ridgeline component is present but renders the generic footer. |
| A16 | Hover shows the peak behind the cursor, always visible | MISSING | No peak labels exist. |
| A17 | Remove "© 2026 Ibrahim Hussain · Built with HTML / CSS / JS" | WRONG | js/site.js line 28 still sets `copyright:'© ... Built with HTML / CSS / JS'`. |
| A18 | Footer contains a circular back-to-top button, arrow up, pressed hover, tooltip "Back to top" | PARTIAL | `#back-top` with `.tip` "Back to top" is on six pages. Its hover/pressed effect is not verified. |
| A19 | Footer placement: fixed at bottom of page, per PLAN1 | UNCLEAR | Footer is at the end of the document (`#footer-host` after `<main>`). PLAN1 says "fixed at the bottom". Needs decision. |
| A20 | Usernames limited to ib_hussain, ib-hussain, ib_hussain@archlinux | DONE | Only `ib-hussain` appears, inside GitHub and LinkedIn URLs. |
| A21 | Icon, cursor and cursor-animation assets present | MISSING | assets/ has none of: favicon.png, icon-*.png, tom-and-jerry-cursor.html, tom.png, jerry.png, the tom-jerry folder. These files appear in your local ib-hussain.github.io tree, so they may be uncommitted. |

## B. Index page

| # | PLAN2 requirement | Status | Evidence |
|---|---|---|---|
| B1 | Hero = `@kokonutui/topo-background.html` (PLAN1 and PLAN2) | WRONG | index.html hero is custom text ("Engineering intelligence."). `topo` count in index.html = 0. |
| B2 | Second theme (mountains and stars) after the hero is scrolled past | MISSING | No match for "mountain" or "star" theme code in the index. |
| B3 | `@kokonutui/metric-card2.html` on the index | MISSING | `metric` count in index.html = 0. The file exists in component-lab/updated-source-previews/ but is unused. |
| B4 | Up to seven macOS widgets using lightbox-grid, varied sizes, intro/who I am/skills/interests | MISSING | `lightbox` and `widget` counts = 0. |
| B5 | Display picture `assets/my-display-pic.jpg` in one widget | MISSING | Referenced only once, in the og:image meta tag. |
| B6 | Photos essence = `shadcn/@reui/c-carousel-9.html` | MISSING | `carousel` count = 0. |
| B7 | Skills section = planet and skills from `dev-portfolios/aahana-surya.github.io` | WRONG | index.html "Skills constellation" is a custom tag sphere, described as "adapted from the supplied Aahana source". `planet` count = 0. The planet was not copied. |
| B8 | Section order: widgets, photos essence, skills (in this exact order) | WRONG | Actual order: hero, "proof", "disciplines" (four track cards), "featured" (four project cards), "skills", "next" (contact). |
| B9 | Content not requested by PLAN2 | WRONG | "proof" section (includes "3 Major connected disciplines", which is not a metric), "Four ways to think" track cards, "Let's build something useful" closing section. |

## C. Dock-linked pages

| Page | PLAN2 requirement | Status | Evidence |
|---|---|---|---|
| Contact | hero-04-art-collage, liquid-gauge2, button-presser2, dialogs 01 and 03 | MISSING | contact.html matches none of these component names. `button-presser2.html` is not in the repo at all. |
| Photos | hero-12, hero-04, feature-03, content-02, then footer; plus card-stack, button-presser2, lightbox-grid, liquid-gauge2 | MISSING | photos.html does not exist. |
| Terminal | macOS-style terminal, tabs are pages, based on akkila.dev | MISSING | terminal.html does not exist. |
| Resume | scroll-index2 with the resume converted to a scrollable page | WRONG | resume.html has no scroll-index reference. It only links to the PDF. |
| Music | liquid-sculpture-hero Component2 hero, a few Mehdi Hassan songs, 1–2 playable | MISSING | music.html does not exist. |
| Movies | old-television-shader hero, Letterboxd-style profile | MISSING | movies.html does not exist. The `Component2.html` source is also absent. |
| Bin | flow-field or wave background, dark, no navbar or footer | MISSING | bin.html does not exist. |
| Projects | halftone-background2 hero, lightbox-grid2 for cards | PARTIAL | projects.html uses halftone. `lightbox-grid2.html` is not in the repo. |
| Projects: card window | Click opens a bigger window with the full old information | PARTIAL | site.js 67-68: the dialog shows only title, description, stack and a link. The full content in js/projects-data.js is not shown. |
| Projects: three mac buttons | All three close the card with an animation | WRONG | site.js 70-80: red closes instantly to a stub (`card.hidden=true`, no animation). Yellow toggles minimise. Green opens the dialog. |

## D. Content accuracy (needs your confirmation)

| Item | Concern |
|---|---|
| Project tech tags (index.html cards) | PyTorch, FinBERT, GNN, Vision Transformer, DCT, Flask, PostgreSQL, Supabase, Financial ML. None of these are in the repo's README text that I can see, and your memory notes do not confirm them. Please confirm each one. |
| Fin-Glassbox description | "market and news representations, risk modelling and fusion constraints". Your notes say stock GNNs and a macro regime classifier. Please confirm the wording. |
| DeepDocForgery and MobileInfoAnalytics cards | Use placeholder art (no real image). MobileInfoAnalytics links to your GitHub profile, not the repo. |
| "Technical overview ↗" links | Point to `#`. |
| Footer tagline "Building intelligent systems, one experiment at a time." | Not in PLAN2. Keep or remove? |
| Old pages still in navigation | about.html, experience.html, components.html remain in the dock and footer. PLAN2 says the dock lists only the eight pages. |

## E. Summary

Iteration 2 has the top-left logo, the greeting's typed command and timing structure, and the usernames right. Most of the rest does not match PLAN2. The index page is missing its hero, widgets, carousel and metric card. The dock labels, icons, position and footer labels do not match. Five of the eight required pages do not exist. The project window's buttons do not match.

## F. What is needed before fixing

1. The full frontend folder (or frontend.zip). This includes the source components PLAN2 names: lightbox-grid2, button-presser2, topo-background2, the old-television Component2, morphic-navbar.tsx, and the `*2.html` files that are missing here.
2. The assets from your local ib-hussain.github.io: favicon.png, icon-*.png, tom-and-jerry-cursor.html and its images. These are not in the public repo.
3. Your PageLoader.jsx from dev-portfolios/Aadarshrai1801-Portfolio, to set the greeting timing from the source instead of from an assumption.
4. The aahana-surya planet source (index.js and index-2d.html).
5. Answers to the questions in the chat.
