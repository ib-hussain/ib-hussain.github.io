/* Source shader port: old-television-shader2.html, supplied by Ibrahim. */
const VERT = `
attribute vec2 aPos;
uniform vec2 uScale;
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = aPos / 4.0 + 0.5;
  vPosition = vec3(aPos, 0.0);
  gl_Position = vec4(aPos * uScale, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;
varying vec3 vPosition;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Fractal noise for more complex texture
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(st);
    st *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Smooth interpolation
float smoothNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = noise(i);
  float b = noise(i + vec2(1.0, 0.0));
  float c = noise(i + vec2(0.0, 1.0));
  float d = noise(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 st = vUv;

  // Create flowing waves
  float wave1 = sin(st.x * 8.0 + uTime * 2.0) * 0.1;
  float wave2 = sin(st.y * 6.0 + uTime * 1.5) * 0.1;
  float wave3 = sin((st.x + st.y) * 4.0 + uTime * 3.0) * 0.05;

  // Mouse interaction
  vec2 mouseInfluence = (uMouse - 0.5) * 0.3;
  st += mouseInfluence;

  float waves = wave1 + wave2 + wave3;

  float noiseValue = smoothNoise(st * 3.0 + uTime * 0.5);
  float fbmNoise = fbm(st * 2.0 + uTime * 0.3);
  float combinedNoise = mix(noiseValue, fbmNoise, 0.6);

  // Mix colors based on waves and noise
  float mixFactor = (waves + combinedNoise + 1.0) * 0.5;
  mixFactor = smoothstep(0.2, 0.8, mixFactor);

  vec3 color = mix(uColorA, uColorB, mixFactor);

  float glow = 1.0 - distance(st, vec2(0.5)) * 1.2;
  glow = smoothstep(0.0, 1.0, glow);
  glow += combinedNoise * 0.2;

  color += glow * 0.15;

  // Time-based brightness variation
  float brightness = 0.9 + sin(uTime * 0.8) * 0.1;
  color *= brightness;

  gl_FragColor = vec4(color, 1.0);
}
`;



/* The shader code above is the supplied old-television-shader2.html WebGL1 source.
   The quad fills the hero; colour uniforms blend it into the portfolio palette. */
(() => {
  'use strict';
  const canvas=document.getElementById('tv-canvas');
  if (!canvas) return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gl;
  try { gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'}); } catch { return; }
  if (!gl) return; // The CSS hero remains a complete fallback.
  function compile(type,source) {
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
    if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  let program;
  try {
    program=gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,VERT));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (error) { console.warn('Film shader unavailable:',error);canvas.hidden=true;return; }
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-2,-2,2,-2,-2,2,-2,2,2,-2,2,2]),gl.STATIC_DRAW);
  const attribute=gl.getAttribLocation(program,'aPos');gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
  const uniform=name=>gl.getUniformLocation(program,name);
  const uScale=uniform('uScale'),uTime=uniform('uTime'),uMouse=uniform('uMouse'),uResolution=uniform('uResolution');
  gl.uniform3f(uniform('uColorA'),.18,.31,.29);
  gl.uniform3f(uniform('uColorB'),.015,.035,.047);
  // aPos runs from -2 to 2: scale by .5 so the shader covers the entire hero.
  gl.uniform2f(uScale,.5,.5);
  let width=1,height=1,active=true,raf=0;
  const target={x:.5,y:.5},smooth={x:.5,y:.5};
  function resize(){const dpr=Math.min(devicePixelRatio||1,2);width=canvas.clientWidth||1;height=canvas.clientHeight||1;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);gl.viewport(0,0,canvas.width,canvas.height);if(reduced)draw(performance.now())}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);resize();
  canvas.closest('.profile-hero').addEventListener('pointermove',event=>{const rect=canvas.getBoundingClientRect();target.x=(event.clientX-rect.left)/rect.width;target.y=1-(event.clientY-rect.top)/rect.height},{passive:true});
  const started=performance.now();
  function draw(now){
    if (gl.isContextLost()) return;
    smooth.x+=(target.x-smooth.x)*.05;smooth.y+=(target.y-smooth.y)*.05;
    gl.uniform1f(uTime,reduced?0:(now-started)/1000);
    gl.uniform2f(uMouse,smooth.x,smooth.y);gl.uniform2f(uResolution,canvas.width,canvas.height);
    gl.drawArrays(gl.TRIANGLES,0,6);
  }
  function frame(now){raf=0;if(!active||document.hidden)return;draw(now);raf=requestAnimationFrame(frame)}
  function resume(){if(!reduced&&active&&!document.hidden&&!raf)raf=requestAnimationFrame(frame)}
  if(reduced)draw(started);else resume();
  document.addEventListener('visibilitychange',resume);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)resume();else if(raf){cancelAnimationFrame(raf);raf=0}},{threshold:0}).observe(canvas);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();if(raf)cancelAnimationFrame(raf);raf=0;canvas.hidden=true});
})();
