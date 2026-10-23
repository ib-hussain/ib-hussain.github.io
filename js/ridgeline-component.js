(()=>{

"use strict";

/* ---- Palettes, copied from the component source ---- */
const PRESETS = {
    evergreen: {
        paper: "#f3f8f5",
        ink: "#14211a",
        muted: "#67776e",
        line: "#dce8e1",
        heart: "#e5484d",
        tones: ["#f3f8f5", "#d4ecdf", "#a5d7bb", "#69b38a", "#2e7c52", "#145131", "#0a2d1a"],
    },
    glacier: {
        paper: "#f2f6fa",
        ink: "#121b26",
        muted: "#637184",
        line: "#dae3ed",
        heart: "#e5484d",
        tones: ["#f2f6fa", "#d6e6f4", "#a8cae7", "#6b9ecc", "#34679a", "#1a3e66", "#0b2140"],
    },
    dusk: {
        paper: "#f8f4f7",
        ink: "#21151f",
        muted: "#7a6876",
        line: "#ecdfe8",
        heart: "#e5484d",
        tones: ["#f8f4f7", "#efdbe7", "#d9b2cb", "#b1789f", "#7a4975", "#4a2750", "#25102c"],
    },
    sepia: {
        paper: "#f7f2ea",
        ink: "#231a10",
        muted: "#7b6d5c",
        line: "#e9dfcf",
        heart: "#d6452f",
        tones: ["#f7f2ea", "#efdfc6", "#ddbb8d", "#bb8a55", "#8a5a2e", "#5a3518", "#2f1a0b"],
    },
    night: {
        paper: "#08100c",
        ink: "#e2eee7",
        muted: "#7d9286",
        line: "#18271f",
        heart: "#ff6369",
        tones: ["#08100c", "#0c1c14", "#123224", "#1a4b33", "#256a48", "#3a8c63", "#62b388"],
    },
};


/* ---- Font stacks ---- */
const SANS_STACK = '"Inter", "Inter Variable", "Geist", "Helvetica Neue", Arial, system-ui, sans-serif'
const MONO_STACK = '"JetBrains Mono", "Geist Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace'

/* ---- Pure helpers (ridge noise, dither, elevation), transpiled from the component source ---- */
// #region ridge
// Pure helpers, lifted out and executed by tests/ridgeline-dither-footer.test.mjs.
/** Hex → [r, g, b] in 0–255, or null for anything that isn't #rgb / #rrggbb. */
function rdfHex(hex) {
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
    if (!m)
        return null;
    const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
/** [r, g, b] → one opaque pixel for a little-endian Uint32 view of ImageData. */
function rdfPack(rgb) {
    return ((255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]) >>> 0;
}
/** The classic 8×8 Bayer matrix, as thresholds in (0, 1). */
const RDF_BAYER = [
    0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26,
    12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
    3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25,
    15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);
/** Palette index for a tone in [0, 1] across `n` colours at Bayer threshold `b`. */
function rdfDither(tone, n, b) {
    const t = tone < 0 ? 0 : tone > 1 ? 1 : tone;
    const v = Math.floor(t * (n - 1) + b);
    return v > n - 1 ? n - 1 : v;
}
/** Integer lattice hash → [0, 1). */
function rdfHash(x, y, seed) {
    let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
}
/** Smooth value noise in [0, 1). */
function rdfNoise(x, y, seed) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = rdfHash(xi, yi, seed);
    const b = rdfHash(xi + 1, yi, seed);
    const c = rdfHash(xi, yi + 1, seed);
    const d = rdfHash(xi + 1, yi + 1, seed);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
/** Fractal value noise, normalised back into [0, 1). */
function rdfFbm(x, y, seed, octaves) {
    let sum = 0;
    let amp = 0.5;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
        sum += rdfNoise(x, y, seed + o * 31) * amp;
        norm += amp;
        x *= 2.03;
        y *= 2.03;
        amp *= 0.5;
    }
    return norm > 0 ? sum / norm : 0;
}
/** Hermite step from e0 to e1, clamped. */
function rdfSmooth(e0, e1, x) {
    const t = e1 === e0 ? (x < e0 ? 0 : 1) : Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
}
/** Ease-out cubic over a progress that may run outside [0, 1]. */
function rdfEase(t) {
    const c = t < 0 ? 0 : t > 1 ? 1 : t;
    return 1 - Math.pow(1 - c, 3);
}
/**
 * Crest row of ridge `i` of `layers` (0 is the farthest) for every column of
 * a `cols` × `rows` grid, plus `margin` columns either side for parallax.
 * Farther ridges sit higher with more, smaller peaks; nearer ones are lower,
 * broader and taller.
 */
function rdfRidgeline(cols, rows, i, layers, seed, margin) {
    const k = layers > 1 ? i / (layers - 1) : 1;
    const n = cols + margin * 2;
    const out = new Float32Array(n);
    const base = rows * (0.38 + 0.66 * Math.pow(k, 1.4));
    const amp = rows * (0.2 + 0.24 * k);
    const freq = 6 - 3.8 * k;
    // Near ridges climb toward both edges, one side more than the other, so the
    // range opens into a valley. Nothing climbs into the faded band at the top.
    const flankL = rows * 0.5 * k * k * k * (0.55 + 0.6 * rdfHash(i, 11, seed));
    const flankR = rows * 0.5 * k * k * k * (0.55 + 0.6 * rdfHash(i, 13, seed));
    const ceil = rows * 0.17;
    const tilt = (rdfHash(i, 7, seed) - 0.5) * rows * 0.34 * (0.4 + k);
    const s = (seed | 0) * 13 + i * 101;
    for (let x = 0; x < n; x++) {
        const u = (x - margin) / cols;
        const r1 = 1 - Math.abs(rdfNoise(u * freq + i * 3.7, 0.5, s) * 2 - 1);
        const r2 = 1 - Math.abs(rdfNoise(u * freq * 2.3, 3.5, s + 1) * 2 - 1);
        const f = rdfFbm(u * freq * 4.1, 9.5, s + 2, 3);
        const h = r1 * r1 * 0.62 + r2 * 0.24 + f * 0.14;
        const e = Math.min(1.2, Math.abs(u * 2 - 1));
        const y = base - h * amp + tilt * (u - 0.5) * 2 - (u < 0.5 ? flankL : flankR) * e * e * Math.sqrt(e);
        out[x] = y < ceil ? ceil - (ceil - y) * 0.25 : y;
    }
    return out;
}
/** Altitude in metres shown for a crest at `crest` rows down a `rows`-tall range. */
function rdfElevation(crest, rows, layer, layers) {
    const up = rows > 0 ? 1 - Math.min(1, Math.max(0, crest / rows)) : 0;
    return Math.round(420 + up * 2600 + (layers - 1 - layer) * 140);
}
// #endregion


const DEFAULT_COLUMNS = [
  {
    title: "Product",
    links: [{ label: "How it works" }, { label: "Integrations" }, { label: "Pricing" }, { label: "Security" }],
  },
  { title: "Company", links: [{ label: "About us" }, { label: "Careers", badge: "Hiring" }, { label: "Contact" }] },
  { title: "Legal", links: [{ label: "Privacy Policy" }, { label: "Terms of Service" }, { label: "Compliance" }] },
];

const DEFAULT_SOCIALS = [
  { icon: "x", href: "https://x.com" },
  { icon: "instagram", href: "https://instagram.com" },
  { icon: "linkedin", href: "https://linkedin.com" },
];

const SOCIAL_NAMES = { x: "X", instagram: "Instagram", linkedin: "LinkedIn", github: "GitHub", youtube: "YouTube" };

const SOCIAL_ICONS = {
  x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.75 3h3.07l-6.71 7.67L22 21h-6.18l-4.84-6.33L5.44 21H2.37l7.18-8.2L2 3h6.33l4.37 5.78L17.75 3zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/>' +
    '<circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="9" width="3.6" height="12"/>' +
    '<circle cx="4.8" cy="4.8" r="2.1"/><path d="M10 9h3.4v1.7c.6-1 1.9-2 3.9-2 3.3 0 4.3 2.1 4.3 5.3V21h-3.6v-6.2c0-1.5-.3-2.9-2.1-2.9s-2.3 1.3-2.3 2.8V21H10z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.1 10.1 0 0 0 22 12.23C22 6.58 17.52 2 12 2z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.9C18.2 4.9 12 4.9 12 4.9s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.9C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.9c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.9c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15.1V8.9l5.2 3.1L10 15.1z"/></svg>',
};

const RIDGE_MARK =
  '<svg class="rdf-mark" viewBox="0 0 30 21" aria-hidden="true">' +
  '<path fill="currentColor" d="M0 21 L10.5 3 L16 12.2 L20.5 6.5 L30 21 Z"/>' +
  '<rect class="rdf-mist-a" x="-2" y="12.6" width="19" height="1.7"/>' +
  '<rect class="rdf-mist-b" x="13" y="16.4" width="19" height="1.7"/></svg>';

const HEART_D = "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 5.3 3 1.7-1.9 3.2-3 5.3-3 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z";

const DEFAULTS = {
  name: "Larchwood Labs",
  brandHref: "#",
  logo: null, // An HTML string here replaces the ridge mark.
  tagline: undefined, // undefined shows the default line; "" hides it.
  columns: DEFAULT_COLUMNS,
  socials: DEFAULT_SOCIALS,
  copyright: undefined,
  credit: { label: "Makora Studio", href: "#" }, // null hides it.
  preset: "auto",
  palette: null,
  seed: 7,
  ridges: 6,
  pixel: 2,
  mist: 0.8,
  drift: 1,
  radius: 130,
  interactive: true,
  altimeter: true,
  maxWidth: "1120px",
  fontFamily: SANS_STACK,
  monoFamily: MONO_STACK,
  height: "680px",
  sceneMinHeight: "260px",
  className: "",
};

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function resolvePalette(cfg, dark) {
  const base =
    cfg.preset === "auto" ? (dark ? PRESETS.night : PRESETS.evergreen) : PRESETS[cfg.preset] || PRESETS.evergreen;
  const colors = Object.assign({}, base, cfg.palette || {});
  const tones = colors.tones && colors.tones.length >= 2 ? colors.tones : base.tones;
  return {
    colors,
    tones,
    deep: tones[Math.max(1, tones.length - 2)],
    accent: tones[Math.max(1, tones.length - 3)],
  };
}

function footerMarkup(cfg) {
  const year = new Date().getFullYear();
  const line = cfg.copyright ?? `© ${year} ${cfg.name}, Inc. All rights reserved.`;
  const logo = cfg.logo ?? RIDGE_MARK;
  const tagline =
    cfg.tagline === ""
      ? ""
      : `<p class="rdf-tag rdf-r" style="--d:230">${esc(
          cfg.tagline ?? `Join thousands of teams already using ${cfg.name} to simplify the way they work.`
        )}</p>`;
  const socials = cfg.socials.length
    ? `<ul class="rdf-social">${cfg.socials
        .map(
          (s, i) =>
            `<li class="rdf-r" style="--d:${320 + i * 60}"><a href="${esc(s.href || "#")}" aria-label="${esc(
              s.label || SOCIAL_NAMES[s.icon]
            )}">${SOCIAL_ICONS[s.icon] || ""}</a></li>`
        )
        .join("")}</ul>`
    : "";
  const columns = cfg.columns
    .map(
      (col, ci) => `
        <nav class="rdf-col" aria-label="${esc(col.title)}">
          <h3 class="rdf-r" style="--d:${260 + ci * 110}">${esc(col.title)}</h3>
          <ul>${col.links
            .map(
              (l, li) =>
                `<li class="rdf-r" style="--d:${330 + ci * 110 + li * 55}"><a class="rdf-link" href="${esc(
                  l.href || "#"
                )}">${esc(l.label)}${l.badge ? `<span class="rdf-badge">${esc(l.badge)}</span>` : ""}</a></li>`
            )
            .join("")}</ul>
        </nav>`
    )
    .join("");
  const credit = cfg.credit
    ? `<a class="rdf-credit" href="${esc(cfg.credit.href || "#")}">Made with<svg class="rdf-heart" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${HEART_D}"/></svg><span class="rdf-sr">love</span>by ${esc(cfg.credit.label)}</a>`
    : "";

  return `
    <div class="rdf-frame">
      <div class="rdf-top">
        <div class="rdf-brand">
          <a class="rdf-logo rdf-r" style="--d:140" href="${esc(cfg.brandHref)}">${logo}<span>${esc(cfg.name)}</span></a>
          ${tagline}
          ${socials}
        </div>
        ${columns}
      </div>
      <div class="rdf-bar rdf-r" style="--d:1250"><p>${esc(line)}</p>${credit}</div>
      <div class="rdf-scene">
        <canvas aria-hidden="true"></canvas>
        <div class="rdf-alt" aria-hidden="true"><b></b><i></i><span></span></div>
      </div>
    </div>`;
}

function mountRidgelineFooter(host, options) {
  const cfg = Object.assign({}, DEFAULTS, options || {});
  const layers = Math.max(2, Math.min(9, Math.round(cfg.ridges)));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const footer = document.createElement("footer");
  footer.className = "rdf-root" + (cfg.className ? " " + cfg.className : "");
  footer.innerHTML = footerMarkup(cfg);
  host.appendChild(footer);

  // When the reveal began (performance.now()). null until the footer is first seen.
  let revealAt = null;

  function isDark() {
    return document.documentElement.classList.contains("dark") || !!footer.closest(".dark");
  }

  let dark = isDark();
  let theme = resolvePalette(cfg, dark);

  function applyPalette() {
    const { colors, deep, accent } = theme;
    const s = footer.style;
    s.minHeight = cfg.height;
    s.setProperty("--rdf-scene-min", cfg.sceneMinHeight);
    s.setProperty("--rdf-paper", colors.paper);
    s.setProperty("--rdf-ink", colors.ink);
    s.setProperty("--rdf-muted", colors.muted);
    s.setProperty("--rdf-line", colors.line);
    s.setProperty("--rdf-heart", colors.heart);
    s.setProperty("--rdf-deep", deep);
    s.setProperty("--rdf-accent", accent);
    s.setProperty("--rdf-n", String(cfg.columns.length));
    s.setProperty("--rdf-max", cfg.maxWidth);
    s.setProperty("--rdf-sans", cfg.fontFamily);
    s.setProperty("--rdf-mono", cfg.monoFamily);
  }

  // The canvas renderer. Returns a stop function. Ported from the component's draw loop.
  function startCanvas() {
    const scene = footer.querySelector(".rdf-scene");
    const canvas = scene.querySelector("canvas");
    const alt = scene.querySelector(".rdf-alt");
    const label = alt.querySelector("span");
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    const tones = theme.tones;
    const pal = new Uint32Array(tones.map((t) => rdfPack(rdfHex(t) || [128, 128, 128])));
    const nTones = pal.length;
    const seed = cfg.seed;

    let p = 2;
    let cols = 1;
    let rows = 1;
    let margin = 2;
    let img = null;
    let buf = new Uint32Array(0);
    let tops = [];
    // Per layer, how deep the valley mist reaches under the crest, along its length.
    let pools = [];
    // Per frame, per layer per column: crest row and slope.
    let colTop = new Float32Array(0);
    let colSlope = new Float32Array(0);
    let colPool = new Float32Array(0);
    let fog = new Float32Array(0);
    let fw = 1;
    let fh = 1;
    let ceil = 0;
    let fadeTo = 1;

    let raf = 0;
    let visible = true;
    let awake = true;
    let stopped = false;
    let lastDraw = 0;
    let lastTick = performance.now();
    // Pointer, in grid cells: target and eased.
    let tx = 0;
    let ty = 0;
    let ex = 0;
    let ey = 0;
    let inside = false;
    let clear = 0;
    // Parallax in -1..1, target and eased.
    let pt = 0;
    let pe = 0;
    let windV = 0;
    let windX = 0;
    let altShown = false;
    let altLabel = "";

    const layout = () => {
      const rect = scene.getBoundingClientRect();
      p = Math.max(1, Math.round(cfg.pixel));
      cols = Math.max(8, Math.ceil(rect.width / p));
      rows = Math.max(8, Math.ceil(rect.height / p));
      canvas.width = cols;
      canvas.height = rows;
      canvas.style.width = cols * p + "px";
      canvas.style.height = rows * p + "px";
      img = ctx.createImageData(cols, rows);
      buf = new Uint32Array(img.data.buffer);
      margin = Math.ceil(cols * 0.045) + 3;
      ceil = Math.max(rows * 0.17, 92 / p);
      fadeTo = Math.max(rows * 0.3, 128 / p);
      tops = [];
      pools = [];
      for (let i = 0; i < layers; i++) {
        const t = rdfRidgeline(cols, rows, i, layers, seed, margin);
        // Keep every crest clear of the copyright line, which overlaps the top of the range.
        for (let x = 0; x < t.length; x++) if (t[x] < ceil) t[x] = ceil - (ceil - t[x]) * 0.2;
        const pool = new Float32Array(t.length);
        for (let x = 0; x < t.length; x++) {
          pool[x] = 0.45 + 1.1 * rdfFbm(((x - margin) / cols) * 4, i * 5.3, seed + 9, 2);
        }
        tops.push(t);
        pools.push(pool);
      }
      colTop = new Float32Array(layers * cols);
      colSlope = new Float32Array(layers * cols);
      colPool = new Float32Array(layers * cols);
      fw = (cols >> 1) + 2;
      fh = (rows >> 1) + 2;
      fog = new Float32Array(fw * fh);
      awake = true;
    };

    const draw = (now) => {
      if (!img) return;
      const dt = Math.min(64, now - lastTick);
      lastTick = now;
      const live = cfg.interactive && !reduced;
      const age = revealAt === null ? -1 : now - revealAt;

      // Ease the pointer, the clearing and the parallax toward their targets.
      const ease = 1 - Math.pow(0.82, dt / 16.7);
      const slow = 1 - Math.pow(0.93, dt / 16.7);
      ex += (tx - ex) * ease;
      ey += (ty - ey) * ease;
      clear += ((inside && cfg.interactive ? 1 : 0) - clear) * slow;
      pe += ((live ? pt : 0) - pe) * slow;
      windV *= Math.pow(0.965, dt / 16.7);
      windX += (windV * dt) / 1000;
      const fogT = (reduced ? 0 : (now / 1000) * 0.045 * Math.max(0, cfg.drift)) + windX;

      // The mist: a wide, slow fractal field at half resolution.
      const sx = 9 / cols;
      const sy = 4.4 / rows;
      for (let gy = 0; gy < fh; gy++) {
        const ny = gy * sy;
        for (let gx = 0; gx < fw; gx++) {
          const nx = gx * sx + fogT;
          const warp = rdfNoise(nx * 0.45 - fogT * 0.6, ny * 0.8, 77) * 0.6;
          const v = rdfFbm(nx + warp, ny + warp * 0.4, 31, 3);
          fog[gy * fw + gx] = rdfSmooth(0.3, 0.74, v);
        }
      }

      // Each ridge's reveal, back to front, and where its crest sits this frame.
      const rev = new Float32Array(layers);
      const k = new Float32Array(layers);
      const toneBase = new Float32Array(layers);
      const fogDepth = new Float32Array(layers);
      for (let i = 0; i < layers; i++) {
        k[i] = i / (layers - 1);
        rev[i] = age < 0 ? 0 : rdfEase((age - 380 - i * 170) / 1300);
        toneBase[i] = 0.16 + 0.76 * Math.pow(k[i], 1.6);
        fogDepth[i] = rows * (0.08 + 0.42 * k[i]);
        const rise = (1 - rev[i]) * rows * 0.09;
        const shift = Math.round(pe * (0.25 + k[i]) * 0.75 * (margin - 3));
        const t = tops[i];
        const last = t.length - 1;
        for (let x = 0; x < cols; x++) {
          const at = x + margin + shift;
          colTop[i * cols + x] = t[at] + rise;
          colSlope[i * cols + x] = t[Math.min(last, at + 2)] - t[Math.max(0, at - 2)];
          colPool[i * cols + x] = fogDepth[i] * pools[i][at];
        }
      }
      const lift = age < 0 ? 1 : 1 - rdfEase((age - 900) / 1800);
      const mistK = Math.max(0, Math.min(1, cfg.mist));
      const r = Math.max(1, cfg.radius / p);
      const r2 = r * r;

      for (let y = 0; y < rows; y++) {
        const fade = rdfSmooth(0, fadeTo, y);
        const frow = (y >> 1) * fw;
        const by = (y & 7) * 8;
        const dyc = (y - ey) * 1.5;
        for (let x = 0; x < cols; x++) {
          let L = -1;
          for (let i = layers - 1; i >= 0; i--) {
            if (y >= colTop[i * cols + x]) {
              L = i;
              break;
            }
          }
          let tone = 0;
          let mk = 0.3;
          if (L >= 0) {
            const kk = k[L];
            const d = y - colTop[L * cols + x];
            const depth = colPool[L * cols + x];
            const crest = 1 - rdfSmooth(0, depth, d) * (0.88 - 0.45 * kk);
            tone = toneBase[L] * crest;
            const sl = colSlope[L * cols + x] * 0.06;
            tone += (sl < -0.2 ? -0.2 : sl > 0.2 ? 0.2 : sl) * (1 - rdfSmooth(0, depth * 0.5, d));
            tone += (rdfHash(x + Math.round(colTop[L * cols + x] * 7), d | 0, L) - 0.5) * 0.07 * kk;
            tone *= rev[L];
            mk = 0.95 - 0.5 * kk;
          } else {
            tone = 0.05 * rdfSmooth(rows * 0.15, rows * 0.6, y);
          }

          let m = fog[frow + (x >> 1)] * mistK * mk;
          if (clear > 0.01) {
            const dx = x - ex;
            const q = (dx * dx + dyc * dyc) / r2;
            if (q < 4) {
              const c = clear * Math.exp(-q);
              m *= 1 - c * 0.92;
              if (L >= 0) tone += c * 0.16 * rev[L];
            }
          }
          // Just under full tone, so even the deepest slope keeps its texture.
          if (tone > 0.93) tone = 0.93;
          m += lift * 0.55;
          if (m > 1) m = 1;
          tone = (tone * (1 - m) + 0.09 * m * (1 - lift)) * fade;

          buf[y * cols + x] = pal[rdfDither(tone, nTones, RDF_BAYER[by + (x & 7)])];
        }
      }
      ctx.putImageData(img, 0, 0);

      // The altimeter rides the crest of the ridge under the pointer.
      let show = false;
      if (cfg.altimeter && inside && age > 1600) {
        const x = Math.max(0, Math.min(cols - 1, Math.round(ex)));
        for (let i = layers - 1; i >= 0; i--) {
          const crest = colTop[i * cols + x];
          if (ey >= crest - 6) {
            show = true;
            alt.style.transform = `translate(${(x * p).toFixed(1)}px,${(crest * p).toFixed(1)}px)`;
            const text = rdfElevation(crest, rows, i, layers).toLocaleString("en-US") + " m";
            if (text !== altLabel) {
              altLabel = text;
              label.textContent = text;
            }
            break;
          }
        }
      }
      if (show !== altShown) {
        altShown = show;
        alt.style.opacity = show ? "1" : "0";
      }

      const settling =
        Math.abs(tx - ex) + Math.abs(ty - ey) > 0.05 ||
        Math.abs((inside && cfg.interactive ? 1 : 0) - clear) > 0.005 ||
        Math.abs((live ? pt : 0) - pe) > 0.001 ||
        Math.abs(windV) > 0.002;
      awake = (age >= 0 && age < 3400) || age < 0 || settling || (!reduced && cfg.drift > 0);
    };

    const busy = () => {
      const age = revealAt === null ? -1 : performance.now() - revealAt;
      return (age >= 0 && age < 3400) || inside || Math.abs(windV) > 0.002 || Math.abs(pt - pe) > 0.001;
    };

    const loop = (now) => {
      raf = 0;
      if (!visible || stopped) return;
      // Nothing to show until the reveal starts; just wait for it.
      if (revealAt === null) {
        raf = requestAnimationFrame(loop);
        return;
      }
      // Full rate while revealing or under the pointer; the idle drift is slow
      // enough that every other frame reads the same.
      if (busy() || now - lastDraw > 32) {
        draw(now);
        lastDraw = now;
      }
      if (awake) raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      awake = true;
      if (!raf && visible && !stopped) raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      if (!cfg.interactive && !cfg.altimeter) return;
      const b = footer.getBoundingClientRect();
      pt = b.width > 0 ? ((e.clientX - b.left) / b.width) * 2 - 1 : 0;
      const s = scene.getBoundingClientRect();
      const lx = (e.clientX - s.left) / p;
      const ly = (e.clientY - s.top) / p;
      const was = inside;
      inside = lx >= 0 && ly >= 0 && lx < cols && ly < rows;
      tx = lx;
      ty = ly;
      if (inside && !was) {
        ex = tx;
        ey = ty;
      }
      wake();
    };

    const onLeave = () => {
      pt = 0;
      inside = false;
      wake();
    };

    const onDown = (e) => {
      if (!cfg.interactive || reduced || !inside) return;
      if (e.target.closest && e.target.closest("a,button")) return;
      // A gust blows the mist away from whichever side was clicked.
      windV += tx < cols / 2 ? 1.4 : -1.4;
      wake();
    };

    layout();
    draw(performance.now());
    wake();

    footer.addEventListener("pointermove", onMove);
    footer.addEventListener("pointerleave", onLeave);
    footer.addEventListener("pointerdown", onDown);
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
      wake();
    });
    ro.observe(scene);
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) {
        lastTick = performance.now();
        wake();
      }
    });
    io.observe(footer);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      footer.removeEventListener("pointermove", onMove);
      footer.removeEventListener("pointerleave", onLeave);
      footer.removeEventListener("pointerdown", onDown);
    };
  }

  // The reveal starts once, the first time a fifth of the footer is on screen.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      if (revealAt === null) revealAt = reduced ? -Infinity : performance.now();
      footer.classList.add("rdf-in");
      revealObserver.disconnect();
    },
    { threshold: 0.2 }
  );
  revealObserver.observe(footer);

  // "auto" follows a .dark class on the page.
  const themeObserver = new MutationObserver(() => {
    if (cfg.preset !== "auto") return;
    const next = isDark();
    if (next === dark) return;
    dark = next;
    theme = resolvePalette(cfg, dark);
    applyPalette();
    restartCanvas();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  applyPalette();
  let stopCanvas = startCanvas();
  function restartCanvas() {
    stopCanvas();
    stopCanvas = startCanvas();
  }

  return {
    element: footer,
    destroy() {
      revealObserver.disconnect();
      themeObserver.disconnect();
      stopCanvas();
      footer.remove();
    },
  };
}

window.RidgelineDitherFooter = { mount: mountRidgelineFooter, PRESETS, defaults: DEFAULTS };


})();