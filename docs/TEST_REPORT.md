# Draft v1 test report — 23 October 2026

Browser: Chromium headless, 1600×900 desktop and 390×844 narrow viewport. For browser tests, the local source HTML/CSS/JS was injected into an isolated browser page because direct browser navigation to localhost/file URLs was restricted by the test environment. Dynamic loaded assets were injected from local copies.

- Rendered all six routes at both viewports (12 renders).
- All tested pages contained a descriptive H1.
- No horizontal overflow at either tested width.
- Footer ridgeline and lamp component mounted on all six routes.
- Console: zero page-level exceptions in the final inline tests.
- Top-flip dock, persistent theme class change, project filters (three AI/ML cards), modal dialog, footer dock-hide and back-to-top passed interaction checks.
- Rotating skills sphere initialised, positioned and rendered.
- Static local asset and page href checks: passed.

Outstanding: full end-to-end HTTP navigation, explicit scroll reload classification, direct page transitions, screen-reader audits, Cumulative Layout Shift, formal performance budgets, external live deployment, monitoring and licensed original Peter sprite have **not** been verified or completed.
