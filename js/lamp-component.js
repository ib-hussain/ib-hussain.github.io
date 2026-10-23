(()=>{

"use strict";

/* ---- Simulation constants, transpiled from the component source ---- */
const WIDTH = 288;
const HEIGHT = 360;
// Where the cord hangs from, under the lamp shade.
const ANCHOR = { x: WIDTH / 2 + 36, y: 116 };
// The cord is a chain of points joined by fixed-length links.
const LINKS = 12;
const LINK = 8.5;
// Simulation, in px and seconds. A fixed step keeps the chain stable on any
// refresh rate.
const STEP = 1 / 120;
const GRAVITY = 1400;
const DAMPING = 0.992;
// Fastest a link may move in one step. Letting go of a stretched cord would
// otherwise fling it up into the shade.
const MAX_SPEED = 4;
// A cord has a little stiffness: two links apart, points never get closer
// than this, so it bends in curves instead of folding into kinks.
const BEND_MIN = LINK * 1.9;
const BEND_STIFFNESS = 0.8;
const ITERATIONS = 14;
// How far past its length the cord has to be pulled to click the switch,
// and how far it can stretch at all. The stretch flattens out, so it slows
// down instead of stopping at a wall.
const CLICK_PULL = 22;
const MAX_STRETCH = 34;
// Below this movement per step for a while, the chain is at rest and the
// loop stops.
const REST_EPSILON = 0.015;
const REST_STEPS = 24;


/* ---- Chain helpers and rest pose, transpiled from the component source ---- */
function damp(distance, max) {
    return max * (1 - Math.exp(-distance / max));
}
function haptic() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(8);
    }
}
/**
 * Move points a and b towards `length` apart. A bend constraint only ever
 * pushes apart, and only part of the way each pass: stiff, not rigid.
 */
function relax(chain, a, b, length, bend) {
    const { xs, ys, held } = chain;
    const aFixed = a === 0 || a === held;
    const bFixed = b === held;
    if (aFixed && bFixed) {
        return;
    }
    const dx = xs[b] - xs[a];
    const dy = ys[b] - ys[a];
    const dist = Math.hypot(dx, dy) || 0.0001;
    if (bend && dist >= length) {
        return;
    }
    const diff = ((dist - length) / dist) * (bend ? BEND_STIFFNESS : 1);
    let wa = 0.5;
    if (aFixed) {
        wa = 0;
    }
    else if (bFixed) {
        wa = 1;
    }
    xs[a] += dx * diff * wa;
    ys[a] += dy * diff * wa;
    xs[b] -= dx * diff * (1 - wa);
    ys[b] -= dy * diff * (1 - wa);
}
/** A smooth curve through the chain's points. */
function cordPath(xs, ys) {
    let d = `M${xs[0].toFixed(2)} ${ys[0].toFixed(2)}`;
    for (let i = 1; i < xs.length - 1; i++) {
        const mx = (xs[i] + xs[i + 1]) / 2;
        const my = (ys[i] + ys[i + 1]) / 2;
        d += ` Q${xs[i].toFixed(2)} ${ys[i].toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
    }
    const n = xs.length - 1;
    d += ` L${xs[n].toFixed(2)} ${ys[n].toFixed(2)}`;
    return d;
}
function restingChain() {
    const xs = new Float64Array(LINKS + 1);
    const ys = new Float64Array(LINKS + 1);
    for (let i = 0; i <= LINKS; i++) {
        xs[i] = ANCHOR.x;
        ys[i] = ANCHOR.y + i * LINK;
    }
    return { xs, ys };
}
const REST = restingChain();
const REST_PATH = cordPath(REST.xs, REST.ys);


function mountPullCord(host, options) {
  const opts = Object.assign({ defaultChecked: true, label: "Desk lamp", onCheckedChange: null }, options || {});
  let checked = opts.defaultChecked;
  let focused = false;
  let grabbing = false;

  const card = document.createElement("div");
  card.className = "pc-card";
  card.innerHTML =
    `<svg class="pc-svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" aria-hidden="true">` +
    `<line class="pc-wire" x1="${WIDTH / 2}" x2="${WIDTH / 2}" y1="0" y2="62" stroke-width="1.5"/>` +
    `<path class="pc-shade" d="M${WIDTH / 2 - 14} 62 h28 l38 50 q2 4 -3 4 h-98 q-5 0 -3 -4 Z"/>` +
    `<path class="pc-bulb" d="M${WIDTH / 2 - 15} 116 a15 13 0 0 0 30 0 Z"/>` +
    `<path class="pc-cord" d="${REST_PATH}" fill="none" stroke-linecap="round" stroke-width="1.5"/>` +
    `<path class="pc-hit" d="${REST_PATH}" fill="none" stroke="transparent" stroke-width="22" pointer-events="stroke"/>` +
    `<g class="pc-bead">` +
    `<circle r="20" fill="transparent"/>` +
    `<rect class="pc-focus" x="-10" y="-4" width="20" height="30" rx="9" stroke-width="2"/>` +
    `<rect class="pc-bead-body" x="-5" y="1" width="10" height="20" rx="5"/>` +
    `</g></svg>` +
    `<div class="pc-caption"><p class="pc-label"></p><p class="pc-state"></p></div>` +
    `<button type="button" class="pc-switch" role="switch"></button>`;
  host.appendChild(card);

  const svg = card.querySelector(".pc-svg");
  const cordEl = card.querySelector(".pc-cord");
  const hitEl = card.querySelector(".pc-hit");
  const beadEl = card.querySelector(".pc-bead");
  const stateEl = card.querySelector(".pc-state");
  const switchEl = card.querySelector(".pc-switch");
  card.querySelector(".pc-label").textContent = opts.label;
  switchEl.setAttribute("aria-label", opts.label);

  // The chain. `held` is the link the hand is holding, or -1.
  const sim = {
    xs: Float64Array.from(REST.xs),
    ys: Float64Array.from(REST.ys),
    pxs: Float64Array.from(REST.xs),
    pys: Float64Array.from(REST.ys),
    raf: 0,
    last: 0,
    carry: 0,
    still: 0,
    held: -1,
    targetX: 0,
    targetY: 0,
    armed: true,
    reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };

  function paint() {
    card.classList.toggle("is-on", checked);
    card.classList.toggle("is-off", !checked);
    stateEl.textContent = (checked ? "On" : "Off") + " · pull the cord";
    switchEl.setAttribute("aria-checked", String(checked));
    /* theme managed by the portfolio shell */
    const status = document.getElementById("status");
    if (status) status.textContent = checked ? "Lamp on" : "Lamp off";
  }

  function setChecked(next) {
    if (next === checked) return;
    checked = next;
    paint();
    if (opts.onCheckedChange) opts.onCheckedChange(next);
  }

  function setGrabbing(on) {
    grabbing = on;
    svg.classList.toggle("grabbing", on);
  }

  function draw() {
    const { xs, ys } = sim;
    const d = cordPath(xs, ys);
    cordEl.setAttribute("d", d);
    hitEl.setAttribute("d", d);
    const n = LINKS;
    const angle = (Math.atan2(xs[n] - xs[n - 1], ys[n] - ys[n - 1]) * 180) / Math.PI;
    beadEl.setAttribute(
      "transform",
      `translate(${xs[n].toFixed(2)} ${ys[n].toFixed(2)}) rotate(${(-angle).toFixed(2)})`
    );
  }

  // Verlet: each free link keeps the velocity it had last step, plus gravity.
  // The held link goes to the hand.
  function integrate() {
    const { xs, ys, pxs, pys } = sim;
    let moved = 0;
    for (let i = 1; i <= LINKS; i++) {
      if (i === sim.held) continue;
      let vx = (xs[i] - pxs[i]) * DAMPING;
      let vy = (ys[i] - pys[i]) * DAMPING;
      const speed = Math.hypot(vx, vy);
      if (speed > MAX_SPEED) {
        vx *= MAX_SPEED / speed;
        vy *= MAX_SPEED / speed;
      }
      pxs[i] = xs[i];
      pys[i] = ys[i];
      xs[i] += vx;
      ys[i] += vy + GRAVITY * STEP * STEP;
      moved = Math.max(moved, Math.abs(vx) + Math.abs(vy));
    }
    if (sim.held > 0) {
      const i = sim.held;
      moved = Math.max(moved, Math.abs(sim.targetX - xs[i]) + Math.abs(sim.targetY - ys[i]));
      pxs[i] = xs[i];
      pys[i] = ys[i];
      xs[i] = sim.targetX;
      ys[i] = sim.targetY;
    }
    return moved;
  }

  // Pull each link back to its length, and keep points two links apart from folding.
  function constrain() {
    for (let k = 0; k < ITERATIONS; k++) {
      for (let i = 0; i < LINKS; i++) relax(sim, i, i + 1, LINK, false);
      for (let i = 0; i + 2 <= LINKS; i++) relax(sim, i, i + 2, BEND_MIN, true);
    }
  }

  function tick(now) {
    sim.raf = 0;
    const elapsed = sim.last ? Math.min((now - sim.last) / 1000, 0.05) : STEP;
    sim.last = now;
    sim.carry += elapsed;
    let moved = 0;
    while (sim.carry >= STEP) {
      moved = Math.max(moved, integrate());
      constrain();
      sim.carry -= STEP;
    }
    draw();
    sim.still = moved < REST_EPSILON ? sim.still + 1 : 0;
    if (sim.held > 0 || sim.still < REST_STEPS) {
      sim.raf = requestAnimationFrame(tick);
    } else {
      sim.last = 0;
    }
  }

  function wake() {
    sim.still = 0;
    if (!sim.raf) sim.raf = requestAnimationFrame(tick);
  }

  function localPoint(event) {
    const rect = svg.getBoundingClientRect();
    const w = rect.width || 1;
    const h = rect.height || 1;
    // The drawing is laid out in its own units; map the pointer into them.
    return {
      x: ((event.clientX - rect.left) / w) * WIDTH,
      y: ((event.clientY - rect.top) / h) * HEIGHT,
    };
  }

  // The hand can pull the cord a little past its length, with growing
  // resistance, but never pull it off the anchor.
  function reach(index, x, y) {
    const dx = x - ANCHOR.x;
    const dy = y - ANCHOR.y;
    const dist = Math.hypot(dx, dy) || 0.0001;
    const length = index * LINK;
    if (dist <= length) return { x, y, pull: 0 };
    const allowed = length + damp(dist - length, MAX_STRETCH);
    return {
      x: ANCHOR.x + (dx / dist) * allowed,
      y: ANCHOR.y + (dy / dist) * allowed,
      pull: dy > 0 ? (allowed - length) * (dy / dist) : 0,
    };
  }

  function onPointerDown(event) {
    if (sim.held > 0) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    const point = localPoint(event);
    // Hold the link nearest to where the cord was grabbed.
    let nearest = LINKS;
    let best = Number.POSITIVE_INFINITY;
    for (let i = 1; i <= LINKS; i++) {
      const d = Math.hypot(sim.xs[i] - point.x, sim.ys[i] - point.y);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    if (svg.setPointerCapture) svg.setPointerCapture(event.pointerId);
    sim.held = nearest;
    sim.targetX = sim.xs[nearest];
    sim.targetY = sim.ys[nearest];
    sim.armed = true;
    setGrabbing(true);
    wake();
  }

  function onPointerMove(event) {
    if (sim.held < 0) return;
    const point = localPoint(event);
    const target = reach(sim.held, point.x, point.y);
    sim.targetX = target.x;
    sim.targetY = target.y;
    // The switch clicks once per pull, as soon as the cord is pulled far
    // enough, not on release. It re-arms when the cord eases back.
    if (sim.armed && target.pull > CLICK_PULL) {
      sim.armed = false;
      haptic();
      setChecked(!checked);
    } else if (!sim.armed && target.pull < CLICK_PULL * 0.4) {
      sim.armed = true;
    }
    wake();
  }

  function onPointerUp() {
    if (sim.held < 0) return;
    sim.held = -1;
    setGrabbing(false);
    if (sim.reduceMotion) {
      // No swinging back: the cord drops straight to rest.
      sim.xs.set(REST.xs);
      sim.ys.set(REST.ys);
      sim.pxs.set(REST.xs);
      sim.pys.set(REST.ys);
      draw();
      return;
    }
    wake();
  }

  function onSwitchActivate() {
    setChecked(!checked);
    if (!sim.reduceMotion) {
      // A small tug on the bead, so the cord answers the key too.
      sim.pys[LINKS] = sim.ys[LINKS] - 5;
      wake();
    }
  }

  svg.addEventListener("pointermove", onPointerMove);
  svg.addEventListener("pointerup", onPointerUp);
  svg.addEventListener("pointercancel", onPointerUp);
  svg.addEventListener("lostpointercapture", onPointerUp);
  hitEl.addEventListener("pointerdown", onPointerDown);
  beadEl.addEventListener("pointerdown", onPointerDown);
  switchEl.addEventListener("click", onSwitchActivate);
  switchEl.addEventListener("focus", () => {
    focused = switchEl.matches(":focus-visible");
    card.classList.toggle("is-focused", focused);
  });
  switchEl.addEventListener("blur", () => {
    focused = false;
    card.classList.remove("is-focused");
  });

  paint();
  draw();

  return {
    element: card,
    isChecked: () => checked,
    setChecked: (next) => setChecked(!!next),
    destroy() {
      cancelAnimationFrame(sim.raf);
      card.remove();
    },
  };
}

window.PullCord = { mount: mountPullCord };

})();