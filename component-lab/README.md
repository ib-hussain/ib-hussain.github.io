# Component Lab — HTML/CSS/JavaScript Preview Library

A standalone, framework-free preview site generated from `frontend.zip`.

## Run

From this directory:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/` in a modern browser. You can also open `index.html` directly (but use a local HTTP server for more reliable image and canvas behaviour).

## Contents

- `index.html`: searchable/filterable catalogue of **31 primary component previews**.
- Source-matched pages, e.g. `@kokonutui/card-stack.html`, `blocks.so/dialogs/02.html`, and `21st.dev/@gughigug/components/liquid-sculpture-hero/Component.html`.
- `source-index.html` and `file-map.json`: map every `.tsx` file in the supplied archive to its browser preview, including supporting components and Usage files (**35 HTML entries**).
- `assets/styles.css`: all styling, including responsive states and component styling.
- `scripts/components.js`: semantic markup and preview data.
- `scripts/effects.js`: native event handlers, keyboard navigation, SVG, Canvas 2D and WebGL2 rendering.

## Accuracy and constraints

- This is a **browser-native reinterpretation** of the provided React/TSX designs, not a transpilation of React and not a pixel-identical rendering. The component layouts, sample copy, source filenames and principal interactions were used as references. Several complex simulations were reimplemented rather than copied.
- Original 21st.dev liquid sculpture uses a GPU particle simulation; this edition uses a lighter Canvas particle field and falls back to the static image when remote images are blocked. Exact particle dynamics differ.
- The ridgeline, topographic background, halftone and shader demos use approximated native Canvas/WebGL visualisations, not the identical TSX algorithms.
- Example logos/photos/fonts are loaded from the *original source-specified URLs* or public image services. They need connectivity and may not load offline; there is no build-time asset download.
- Links in visual demos are illustrative and do not perform network writes, payments, deletions, sign-outs, deployments or account changes.
- `site-lists.md` contains seven external Efferd links and CLI commands but no corresponding TSX source files; these are not reproduced as source-matched components.
- The source `shadcn/@reui/c-icon-stack-3.tsx` has a malformed JSX `className` attribute; this preview uses the intended icon-stack appearance rather than copying malformed syntax.

## Testing

Try opening/closing dialogs, completing onboarding steps, dragging the gauge and cards, opening the lightbox, switching chart periods, using tab keyboard controls, and switching themes. Each demo is separately addressable for selection.
