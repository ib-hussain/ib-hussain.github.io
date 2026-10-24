/* Component source: liquid-gauge-for-setting-levels2.html */

(() => {
"use strict";

/* ---- Constants, clamp, surface and bubble helpers, transpiled from the component source ---- */
// The surface is a row of columns joined by springs. Each column bobs
// around the fill line and pulls on its neighbours, so a push travels.
const COLUMNS = 28;
// Simulation, in px and seconds, on a fixed step.
const STEP = 1 / 120;
const SPREAD = 2600;
const RESTORE = 18;
const SURFACE_DAMPING = 2.2;
// The fill line follows the value on an underdamped spring, so a big change
// overshoots a little and settles, like a poured glass.
const LEVEL_STIFFNESS = 90;
const LEVEL_DAMPING = 11;
// How hard a sideways drag rocks the liquid, and how hard the pointer
// stirs it when moving through it.
const SLOSH = 4.5;
const STIR = 20;
const MAX_WAVE = 26;
// The meniscus: a lighter band riding just above the surface.
const RIM = 3;
// Bubbles rise while the level is climbing.
const BUBBLES = 10;
const BUBBLE_RATE = 0.06;
const REST_EPSILON = 0.02;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
function haptic() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(6);
    }
}
function surfacePolygon(heights, levelY, width, height, lift) {
    let points = "";
    for (let i = 0; i < COLUMNS; i++) {
        const x = (i / (COLUMNS - 1)) * width;
        const y = clamp(levelY + heights[i] - lift, -40, height + 40);
        points += `${x.toFixed(1)}px ${y.toFixed(1)}px,`;
    }
    return `polygon(${points}${width}px ${height + 40}px,0px ${height + 40}px)`;
}
function flatPolygon(value, lift = 0) {
    const top = 100 - value;
    return `polygon(0% calc(${top}% - ${lift}px),100% calc(${top}% - ${lift}px),100% 100%,0% 100%)`;
}
function drawBubbles(bubbles, nodes, time) {
    bubbles.forEach((bubble, i) => {
        const node = nodes[i];
        if (!node) {
            return;
        }
        if (!bubble.alive) {
            node.style.opacity = "0";
            return;
        }
        const sway = Math.sin(time * 7 + bubble.phase) * 2.5;
        node.style.opacity = "1";
        node.style.transform = `translate3d(${(bubble.x + sway - bubble.r).toFixed(1)}px,${(bubble.y - bubble.r).toFixed(1)}px,0) scale(${(bubble.r / 4).toFixed(3)})`;
    });
}
function setText(nodes, text) {
    for (const node of nodes) {
        if (node) {
            node.textContent = text;
        }
    }
}


function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

const TICKS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

function faceMarkup(initial, label, total, unit) {
  const used = ((Math.round(initial) / 100) * total).toFixed(1);
  return (
    '<div class="lg-face">' +
    '<div class="g-top">' +
    `<p class="g-label">${esc(label)}</p>` +
    `<p class="g-pct"><span data-pct>${Math.round(initial)}</span><span class="g-unit">%</span></p>` +
    `<p class="g-used"><span data-used>${used}</span> of ${esc(total)} ${esc(unit)} used</p>` +
    "</div>" +
    '<p class="g-status" data-status></p>' +
    '<div class="g-ticks">' +
    TICKS.map((t) => `<span class="g-tick${t === 50 ? " major" : ""}" style="top:${100 - t}%"></span>`).join("") +
    "</div>" +
    "</div>"
  );
}

/* Mounts a gauge into `host`. Options (or window.LiquidGaugeConfig):
   value (initial, 0-100), defaultValue, readOnly, label, total, unit, warnAt, onValueChange. */
function mountLiquidGauge(host, options) {
  const P = Object.assign(
    { value: undefined, defaultValue: 72, readOnly: false, label: "Storage", total: 128, unit: "GB", warnAt: 90, onValueChange: null },
    window.LiquidGaugeConfig || {},
    options || {}
  );
  let total = P.total;
  const initial = clamp(P.value ?? P.defaultValue, 0, 100);
  let value = initial;
  let dragging = false;

  host.innerHTML =
    `<div class="lg-root${P.readOnly ? " ro" : ""}" role="slider" aria-orientation="vertical" aria-label="${esc(P.label)}"` +
    ` aria-valuemin="0" aria-valuemax="100" tabindex="${P.readOnly ? -1 : 0}">` +
    faceMarkup(initial, P.label, total, P.unit) +
    `<div class="lg-rim" aria-hidden="true" style="clip-path:${flatPolygon(initial, RIM)}"></div>` +
    `<div class="lg-liquid" aria-hidden="true" style="clip-path:${flatPolygon(initial)}">` +
    faceMarkup(initial, P.label, total, P.unit) +
    Array.from({ length: BUBBLES }, () => '<span class="bubble"></span>').join("") +
    "</div>" +
    "</div>";

  const root = host.querySelector(".lg-root");
  const liquid = root.querySelector(".lg-liquid");
  const rim = root.querySelector(".lg-rim");
  const bubbleNodes = Array.from(liquid.querySelectorAll(".bubble"));
  const pctNodes = Array.from(root.querySelectorAll("[data-pct]"));
  const usedNodes = Array.from(root.querySelectorAll("[data-used]"));
  const statusNodes = Array.from(root.querySelectorAll("[data-status]"));

  const s = {
    heights: new Float64Array(COLUMNS),
    speeds: new Float64Array(COLUMNS),
    level: value,
    levelSpeed: 0,
    target: value,
    width: 0,
    height: 0,
    bubbles: Array.from({ length: BUBBLES }, () => ({ x: 0, y: 0, r: 0, speed: 0, phase: 0, alive: false })),
    spawn: 0,
    shown: Math.round(value),
    raf: 0,
    last: 0,
    carry: 0,
    time: 0,
    pointerX: -1,
    pointerId: -1,
    visible: true,
    reduceMotion: false,
  };

  /* Text and ARIA that follow the value (React re-rendered these; the simulation owns the readout). */
  const reflect = () => {
    const warn = value >= P.warnAt;
    const rounded = Math.round(value);
    const used = ((rounded / 100) * total).toFixed(1);
    const status = warn ? "Almost full" : `${100 - rounded}% free`;
    root.setAttribute("aria-valuenow", String(rounded));
    root.setAttribute("aria-valuetext", `${rounded}%, ${used} of ${total} ${P.unit} used`);
    if (P.readOnly) {
      root.setAttribute("aria-readonly", "true");
    }
    statusNodes.forEach((n) => { n.textContent = status; });
    rim.classList.toggle("warn", warn);
    liquid.classList.toggle("warn", warn);
    root.classList.toggle("grab", dragging && !P.readOnly);
    root.classList.toggle("ns", !dragging && !P.readOnly);
    root.classList.toggle("ro", P.readOnly);
  };

  const setText = (nodes, text) => nodes.forEach((n) => { n.textContent = text; });

  const draw = () => {
    const { width, height } = s;
    if (!(width && height)) {
      return;
    }
    const levelY = height * (1 - s.level / 100);
    liquid.style.clipPath = surfacePolygon(s.heights, levelY, width, height, 0);
    rim.style.clipPath = surfacePolygon(s.heights, levelY, width, height, RIM);
    drawBubbles(s.bubbles, bubbleNodes, s.time);
    const shown = Math.round(clamp(s.level, 0, 100));
    if (shown !== s.shown) {
      s.shown = shown;
      setText(pctNodes, String(shown));
      setText(usedNodes, ((shown / 100) * total).toFixed(1));
    }
  };

  const spawnBubbles = (dt) => {
    s.spawn += Math.max(0, s.levelSpeed) * BUBBLE_RATE * dt;
    while (s.spawn >= 1) {
      s.spawn -= 1;
      const free = s.bubbles.find((b) => !b.alive);
      if (!free) {
        s.spawn = 0;
        break;
      }
      free.alive = true;
      free.x = s.width * (0.12 + Math.random() * 0.76);
      free.y = s.height - 6;
      free.r = 1.5 + Math.random() * 2.5;
      free.speed = 70 + Math.random() * 80;
      free.phase = Math.random() * Math.PI * 2;
    }
  };

  const advanceBubbles = (dt) => {
    const levelY = s.height * (1 - s.level / 100);
    const column = (x) => clamp(Math.round((x / s.width) * (COLUMNS - 1)), 0, COLUMNS - 1);
    let alive = 0;
    for (const bubble of s.bubbles) {
      if (!bubble.alive) {
        continue;
      }
      bubble.y -= bubble.speed * dt;
      const i = column(bubble.x);
      // At the surface it pops, and leaves a tiny dimple behind.
      if (bubble.y - bubble.r <= levelY + s.heights[i]) {
        bubble.alive = false;
        s.speeds[i] += bubble.r * 6;
      } else {
        alive++;
      }
    }
    return alive;
  };

  const step = () => {
    const { heights, speeds } = s;
    // Fill line spring.
    const force = (s.target - s.level) * LEVEL_STIFFNESS - s.levelSpeed * LEVEL_DAMPING;
    s.levelSpeed += force * STEP;
    s.level += s.levelSpeed * STEP;
    // Surface springs, with walls that reflect.
    let energy = Math.abs(s.target - s.level) + Math.abs(s.levelSpeed) * 0.1;
    for (let i = 0; i < COLUMNS; i++) {
      const left = heights[i > 0 ? i - 1 : i];
      const right = heights[i < COLUMNS - 1 ? i + 1 : i];
      const accel = (left + right - 2 * heights[i]) * SPREAD - heights[i] * RESTORE - speeds[i] * SURFACE_DAMPING;
      speeds[i] += accel * STEP;
    }
    for (let i = 0; i < COLUMNS; i++) {
      heights[i] = clamp(heights[i] + speeds[i] * STEP, -MAX_WAVE, MAX_WAVE);
      energy = Math.max(energy, Math.abs(heights[i]), Math.abs(speeds[i]) * 0.1);
    }
    s.time += STEP;
    return energy;
  };

  const tick = (now) => {
    s.raf = 0;
    const elapsed = s.last ? Math.min((now - s.last) / 1000, 0.05) : STEP;
    s.last = now;
    s.carry += elapsed;
    let energy = 0;
    while (s.carry >= STEP) {
      energy = Math.max(energy, step());
      s.carry -= STEP;
    }
    spawnBubbles(elapsed);
    const bubbles = advanceBubbles(elapsed);
    draw();
    const busy = s.pointerId >= 0 || bubbles > 0 || energy > REST_EPSILON;
    if (busy && s.visible) {
      s.raf = requestAnimationFrame(tick);
    } else {
      s.last = 0;
      if (!busy) {
        // Settle exactly, so the resting surface is flat.
        s.level = s.target;
        s.levelSpeed = 0;
        s.heights.fill(0);
        s.speeds.fill(0);
        draw();
      }
    }
  };

  const wake = () => {
    if (!s.raf && s.visible) {
      s.raf = requestAnimationFrame(tick);
    }
  };

  /* The spring takes a new value from here. */
  const applyValue = () => {
    if (s.target === value) {
      return;
    }
    s.target = value;
    if (s.reduceMotion) {
      s.level = value;
      s.levelSpeed = 0;
      draw();
      return;
    }
    wake();
  };

  const setValue = (next) => {
    const rounded = Math.round(clamp(next, 0, 100));
    value = rounded;
    if (P.onValueChange) {
      P.onValueChange(rounded);
    }
    reflect();
    applyValue();
  };

  const valueAt = (clientY) => {
    const rect = root.getBoundingClientRect();
    return (1 - (clientY - rect.top) / rect.height) * 100;
  };

  // Push the columns around x by `amount`, fading out over a few columns.
  const disturb = (clientX, amount, reach = 3) => {
    const rect = root.getBoundingClientRect();
    if (s.reduceMotion) {
      return;
    }
    const center = ((clientX - rect.left) / rect.width) * (COLUMNS - 1);
    for (let i = 0; i < COLUMNS; i++) {
      const falloff = 1 - Math.abs(i - center) / reach;
      if (falloff > 0) {
        s.speeds[i] += amount * falloff;
      }
    }
  };

  const setDragging = (on) => {
    dragging = on;
    reflect();
  };

  const onDown = (event) => {
    if (P.readOnly || (event.pointerType === "mouse" && event.button !== 0)) {
      return;
    }
    root.setPointerCapture(event.pointerId);
    s.pointerId = event.pointerId;
    s.pointerX = event.clientX;
    setDragging(true);
    // The press itself lands like a drop.
    disturb(event.clientX, 260, 2.5);
    setValue(valueAt(event.clientY));
    wake();
  };

  const onMove = (event) => {
    const dx = s.pointerX < 0 ? 0 : event.clientX - s.pointerX;
    s.pointerX = event.clientX;
    if (s.reduceMotion) {
      if (s.pointerId === event.pointerId) {
        setValue(valueAt(event.clientY));
      }
      return;
    }
    if (s.pointerId === event.pointerId) {
      // A sideways drag rocks the whole body: one side rises, the other falls.
      for (let i = 0; i < COLUMNS; i++) {
        s.speeds[i] += ((i / (COLUMNS - 1)) * 2 - 1) * dx * SLOSH;
      }
      setValue(valueAt(event.clientY));
      wake();
      return;
    }
    // Hovering through the liquid stirs it, behind the cursor.
    const rect = root.getBoundingClientRect();
    if (event.pointerType !== "mouse" || dx === 0) {
      return;
    }
    const levelY = rect.height * (1 - s.level / 100);
    if (event.clientY - rect.top > levelY + 8) {
      disturb(event.clientX, Math.abs(dx) * STIR, 2);
      wake();
    }
  };

  const onUp = (event) => {
    if (s.pointerId !== event.pointerId) {
      return;
    }
    s.pointerId = -1;
    setDragging(false);
    if (navigator.vibrate) {
      navigator.vibrate(6);
    }
    wake();
  };

  const onLeave = () => {
    if (s.pointerId < 0) {
      s.pointerX = -1;
    }
  };

  const onKey = (event) => {
    if (P.readOnly) {
      return;
    }
    const steps = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 };
    let next;
    if (event.key in steps) {
      next = value + steps[event.key] * (event.shiftKey ? 10 : 1);
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = 100;
    }
    if (next === undefined) {
      return;
    }
    event.preventDefault();
    // A keyed change still lands with a small ripple.
    const rect = root.getBoundingClientRect();
    disturb(rect.left + rect.width / 2, next > value ? 120 : -120, 4);
    setValue(next);
    wake();
  };

  root.addEventListener("pointerdown", onDown);
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerup", onUp);
  root.addEventListener("pointercancel", onUp);
  root.addEventListener("lostpointercapture", onUp);
  root.addEventListener("pointerleave", onLeave);
  root.addEventListener("keydown", onKey);

  // Reduced motion is read live.
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  s.reduceMotion = motionQuery.matches;
  const onMotion = () => { s.reduceMotion = motionQuery.matches; };
  motionQuery.addEventListener("change", onMotion);

  const resize = new ResizeObserver(([entry]) => {
    s.width = entry.contentRect.width;
    s.height = entry.contentRect.height;
    draw();
  });
  resize.observe(root);

  // Offscreen or in a background tab, the loop waits.
  const pause = () => {
    if (!s.visible && s.raf) {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.last = 0;
    } else if (s.visible) {
      wake();
    }
  };
  let onScreen = true;
  const intersection = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    s.visible = onScreen && !document.hidden;
    pause();
  });
  intersection.observe(root);
  const onVisibility = () => {
    s.visible = onScreen && !document.hidden;
    pause();
  };
  document.addEventListener("visibilitychange", onVisibility);

  reflect();

  return {
    element: root,
    getValue: () => value,
    setValue,
    setTotal(next) {
      total = next;
      s.shown = -1;
      reflect();
      draw();
    },
    destroy() {
      cancelAnimationFrame(s.raf);
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotion);
      root.remove();
    },
  };
}

window.LiquidGauge = { mount: mountLiquidGauge };


})();
