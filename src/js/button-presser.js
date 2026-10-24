/* Adapted from supplied button-presser2.html */

"use strict";

const HEIGHT = 68;
const BODY_WIDTH = 236;
const STUB_WIDTH = 76;
const TEAR_ANGLE = 34;
const HOLES = 7;
const HOLD = 0.55;
const HOLD_SHARE = 0.3;
const SWING_STIFFNESS = 900;
const SWING_DAMPING = 42;
const RETURN_STIFFNESS = 520;
const RETURN_DAMPING = 22;
const GRAVITY = 2600;
const FALL_DISTANCE = 220;
const STEP = 1 / 120;
const FIBRES = [
  1.6, 0.4, 2.2, 0.9, 1.8, 0.2, 2.4, 1.1, 0.5, 2, 1.4, 0.3, 2.3, 0.8, 1.7, 0.1,
  2.1, 1.2, 0.6, 1.9,
];
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const RESET_AFTER = 2400;

const TRASH = `<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>`;
const CHECK = `<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const TEAR_ICON = `<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M6 6c6 0 12 3 12 11M14 14l4 4 4-4"/></svg>`;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function haptic(ms) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
}

// Raw pull (0..1+) to how far the tear has run, holding at each hole.
function stickSlip(pull) {
  const scaled = clamp(pull, 0, 1) * HOLES;
  const hole = Math.min(Math.floor(scaled), HOLES - 1);
  const f = scaled - hole;
  const given = f < HOLD
    ? (f / HOLD) * HOLD_SHARE
    : HOLD_SHARE + ((f - HOLD) / (1 - HOLD)) * (1 - HOLD_SHARE);
  return (hole + given) / HOLES;
}

// One side of the tear as a clip-path: ragged down to `tip` px, straight below.
function tornEdge(tip, width, side) {
  const points = [];
  const edge = side === 1 ? width : 0;
  const far = side === 1 ? 0 : width;
  points.push(`${far}px 0px`);
  const rows = Math.ceil((tip / HEIGHT) * FIBRES.length);
  for (let k = 0; k <= rows; k++) {
    const y = Math.min((k / FIBRES.length) * HEIGHT, tip);
    const x = edge - side * FIBRES[k % FIBRES.length];
    points.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
  }
  points.push(`${edge}px ${tip.toFixed(1)}px`, `${edge}px ${HEIGHT}px`, `${far}px ${HEIGHT}px`);
  return `polygon(${points.join(",")})`;
}

const TONE_CLASS = { default: "tone-default", muted: "tone-muted", danger: "tone-danger" };

function createTear(host, options = {}) {
  const o = {
    tone: "default",
    icon: TRASH,
    label: "Delete workspace",
    description: "Tear off the stub to confirm",
    stubLabel: "Tear",
    confirmedLabel: "Workspace deleted",
    confirmedDescription: "Kept in trash for 30 days",
    onConfirm: null,
    resetAfter: RESET_AFTER,
    ...options,
  };

  // Root, body and its two text lines.
  const root = document.createElement("div");
  root.className = `tear ${TONE_CLASS[o.tone] ?? TONE_CLASS.default}`;
  root.tabIndex = -1;
  root.dataset.phase = "idle";

  const body = document.createElement("div");
  body.className = "body";
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.setAttribute("aria-hidden", "true");

  const lines = document.createElement("span");
  lines.className = "lines";
  const askLine = makeLine(o.label, o.description);
  const doneLine = makeLine(o.confirmedLabel, o.confirmedDescription);
  doneLine.classList.add("off");
  lines.append(askLine, doneLine);
  body.append(chip, lines);

  const live = document.createElement("span");
  live.className = "sr";
  live.setAttribute("aria-live", "polite");

  root.append(body, live);
  host.append(root);

  function makeLine(title, sub) {
    const line = document.createElement("span");
    line.className = "line";
    const t = document.createElement("span");
    t.className = "t";
    t.textContent = title;
    const s = document.createElement("span");
    s.className = "s";
    s.textContent = sub;
    line.append(t, s);
    return line;
  }

  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sim = {
    angle: 0, speed: 0, target: 0, held: false, grabAngle: 0, hole: 0,
    raf: 0, last: 0, carry: 0,
    x: 0, y: 0, vx: 0, vy: 0, spin: 0,
    px: 0, py: 0, pt: 0, pvx: 0, pvy: 0,
    auto: 0, flying: false, reduceMotion: reduceQuery.matches,
  };
  reduceQuery.addEventListener("change", () => (sim.reduceMotion = reduceQuery.matches));

  let phase = "idle";
  let stub = null;
  let hadFocus = false;
  let resetTimer = 0;
  let fadeTimer = 0;

  function hinge() {
    const rect = root.getBoundingClientRect();
    return { x: rect.left + BODY_WIDTH, y: rect.top + HEIGHT };
  }

  function drawTear() {
    const tip = clamp(sim.angle / TEAR_ANGLE, 0, 1) * HEIGHT;
    body.style.clipPath = tip > 0.5 ? tornEdge(tip, BODY_WIDTH, 1) : "";
    if (stub) {
      stub.style.clipPath = tip > 0.5 ? tornEdge(tip, STUB_WIDTH, -1) : "";
      stub.style.transform = `rotate(${sim.angle.toFixed(2)}deg)`;
    }
  }

  function drawFlight() {
    if (!stub) return;
    const fade = clamp(1 - (sim.y - FALL_DISTANCE * 0.5) / (FALL_DISTANCE * 0.5), 0, 1);
    stub.style.transform = `translate(${sim.x.toFixed(1)}px, ${sim.y.toFixed(1)}px) rotate(${sim.angle.toFixed(1)}deg)`;
    stub.style.opacity = fade.toFixed(3);
  }

  function setPhase(next) {
    phase = next;
    root.dataset.phase = next;
    const done = next === "flying" || next === "torn";
    chip.classList.toggle("done", done);
    chip.innerHTML = done ? CHECK : o.icon;
    askLine.classList.toggle("off", done);
    doneLine.classList.toggle("off", !done);
    askLine.setAttribute("aria-hidden", String(done));
    doneLine.setAttribute("aria-hidden", String(!done));
    live.textContent = done ? o.confirmedLabel : "";

    if (next === "flying" && sim.reduceMotion) {
      // Reduced motion: the stub fades where it tore instead of falling.
      sim.raf = 0;
      sim.last = 0;
      if (stub) {
        stub.style.transition = `opacity 180ms ${EASE_OUT}`;
        stub.style.opacity = "0";
      }
      clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(() => setPhase("torn"), 180);
    }

    if (next === "torn") {
      unmountStub();
      if (hadFocus) root.focus({ preventScroll: true });
      if (o.resetAfter) {
        clearTimeout(resetTimer);
        resetTimer = window.setTimeout(reset, o.resetAfter);
      }
    }

    if (next === "idle" && hadFocus && stub) {
      hadFocus = false;
      stub.focus({ preventScroll: true });
    }
  }

  function detach() {
    sim.held = false;
    haptic(14);
    // The stub leaves with the swing it had, plus the hand's throw.
    const rad = (sim.angle * Math.PI) / 180;
    const tangential = ((sim.speed * Math.PI) / 180) * HEIGHT;
    sim.x = 0;
    sim.y = 0;
    sim.vx = Math.cos(rad) * tangential + clamp(sim.pvx, -900, 900) * 0.6 + 90;
    sim.vy = Math.sin(rad) * tangential + clamp(sim.pvy, -900, 900) * 0.6 - 120;
    sim.spin = sim.speed * 0.6 + 140;
    sim.flying = true;
    if (stub) {
      stub.style.transition = "none";
      hadFocus = document.activeElement === stub;
    }
    setPhase("flying");
    o.onConfirm?.();
  }

  // While attached: the swing chases its target, held or springing home.
  function stepSwing() {
    const held = sim.held || sim.auto;
    const stiffness = held ? SWING_STIFFNESS : RETURN_STIFFNESS;
    const damping = held ? SWING_DAMPING : RETURN_DAMPING;
    const force = (sim.target - sim.angle) * stiffness - sim.speed * damping;
    sim.speed += force * STEP;
    sim.angle += sim.speed * STEP;
    // A tick for each hole that gives.
    const hole = Math.floor(clamp(sim.angle / TEAR_ANGLE, 0, 1) * HOLES);
    if (hole > sim.hole) haptic(3);
    sim.hole = hole;
    return sim.angle >= TEAR_ANGLE * 0.995;
  }

  function stepFlight() {
    sim.vy += GRAVITY * STEP;
    sim.x += sim.vx * STEP;
    sim.y += sim.vy * STEP;
    sim.angle += sim.spin * STEP;
    return sim.y > FALL_DISTANCE;
  }

  // Runs the fixed steps owed since the last frame. True once this phase is over.
  function advance(elapsed) {
    sim.carry += elapsed;
    let finished = false;
    while (sim.carry >= STEP && !finished) {
      sim.carry -= STEP;
      if (sim.flying) {
        finished = stepFlight();
      } else if (sim.auto) {
        sim.target = Math.min(sim.target + STEP * 60, TEAR_ANGLE * 1.05);
        finished = stepSwing();
      } else {
        finished = stepSwing() && sim.held;
      }
    }
    return finished;
  }

  function tick(now) {
    sim.raf = 0;
    const elapsed = sim.last ? Math.min((now - sim.last) / 1000, 0.05) : STEP;
    sim.last = now;
    const wasFlying = sim.flying;
    const finished = advance(elapsed);
    if (wasFlying) {
      drawFlight();
      if (finished) {
        sim.last = 0;
        setPhase("torn");
        return;
      }
      sim.raf = requestAnimationFrame(tick);
      return;
    }
    drawTear();
    if (finished) {
      sim.auto = 0;
      detach();
      if (!sim.reduceMotion) sim.raf = requestAnimationFrame(tick);
      return;
    }
    const resting = !(sim.held || sim.auto) && Math.abs(sim.angle) < 0.02 && Math.abs(sim.speed) < 0.05;
    if (!resting) {
      sim.raf = requestAnimationFrame(tick);
      return;
    }
    sim.angle = 0;
    sim.speed = 0;
    sim.last = 0;
    drawTear();
    setPhase("idle");
  }

  function wake() {
    if (!sim.raf) sim.raf = requestAnimationFrame(tick);
  }

  // Pointer and key handlers for the stub.
  function onPointerDown(e) {
    if (phase === "flying" || phase === "torn") return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    stub.setPointerCapture(e.pointerId);
    const h = hinge();
    sim.grabAngle = (Math.atan2(e.clientY - h.y, e.clientX - h.x) * 180) / Math.PI - sim.angle;
    sim.held = true;
    sim.px = e.clientX;
    sim.py = e.clientY;
    sim.pt = e.timeStamp;
    sim.pvx = 0;
    sim.pvy = 0;
    setPhase("tearing");
    wake();
  }

  function onPointerMove(e) {
    if (!sim.held) return;
    const dt = e.timeStamp - sim.pt;
    if (dt > 0) {
      sim.pvx = sim.pvx * 0.5 + ((e.clientX - sim.px) / dt) * 500;
      sim.pvy = sim.pvy * 0.5 + ((e.clientY - sim.py) / dt) * 500;
    }
    sim.px = e.clientX;
    sim.py = e.clientY;
    sim.pt = e.timeStamp;
    const h = hinge();
    const raw = (Math.atan2(e.clientY - h.y, e.clientX - h.x) * 180) / Math.PI - sim.grabAngle;
    // Pushing the stub back into the body only gives a little.
    const pull = raw < 0 ? raw * 0.15 : raw;
    sim.target = pull >= TEAR_ANGLE
      ? TEAR_ANGLE * 1.05
      : stickSlip(Math.max(pull, 0) / TEAR_ANGLE) * TEAR_ANGLE + Math.min(pull, 0);
    wake();
  }

  function onPointerUp() {
    if (!sim.held) return;
    sim.held = false;
    // Not torn through: the stub swings back and the perforation holds.
    sim.target = 0;
    wake();
  }

  function onKeyDown(e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (phase !== "idle" || e.repeat) return;
    // From the keyboard the stub tears itself, hole by hole.
    sim.auto = 1;
    sim.target = 0;
    setPhase("tearing");
    wake();
  }

  function mountStub(fresh) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "stub" + (fresh ? " fresh" : "");
    b.setAttribute("aria-label", `${o.label}: ${o.description}`);
    b.style.transformOrigin = "0 100%";
    const perf = document.createElement("span");
    perf.className = "perf";
    perf.setAttribute("aria-hidden", "true");
    const icon = document.createElement("span");
    icon.innerHTML = TEAR_ICON;
    icon.style.display = "contents";
    const lbl = document.createElement("span");
    lbl.className = "lbl";
    lbl.textContent = o.stubLabel;
    b.append(perf, icon, lbl);
    b.addEventListener("keydown", onKeyDown);
    b.addEventListener("pointerdown", onPointerDown);
    b.addEventListener("pointermove", onPointerMove);
    b.addEventListener("pointerup", onPointerUp);
    b.addEventListener("pointercancel", onPointerUp);
    b.addEventListener("lostpointercapture", onPointerUp);
    root.insertBefore(b, live);
    stub = b;
  }

  function unmountStub() {
    if (stub) stub.remove();
    stub = null;
  }

  // A fresh stub, a little while after the last one came away.
  function reset() {
    sim.angle = 0;
    sim.speed = 0;
    sim.target = 0;
    sim.hole = 0;
    sim.flying = false;
    mountStub(true);
    setPhase("idle");
  }

  setPhase("idle");
  mountStub(true);
  return {
    root,
    get phase() { return phase; },
  };
}


window.TearButton={mount:createTear};
