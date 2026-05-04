const fishLayer   = document.getElementById('fish-layer');
const bubblesLayer = document.getElementById('bubbles-layer');
const hint         = document.getElementById('hint');

const COLORS = [
  '#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b',
  '#cc5de8','#f06595','#20c997','#74c0fc','#a9e34b',
  '#ff8787','#ffa94d','#38d9a9','#748ffc','#da77f2',
];

let hintVisible = true;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

/*
 * Build an SVG fish. When facingRight=false the graphic is mirrored inside
 * the SVG so the label always reads left-to-right.
 * Canvas:  width=size, height=size*0.72
 * Body:    ellipse centred at (54%, 60%) of canvas, leaving room above for dorsal fin
 * Tail:    forked caudal fin extending left (flipped when facing left)
 */
function makeFishSVG(color, size, label, facingRight) {
  const w  = size;
  const h  = Math.round(size * 0.72);
  const dark  = darkenHex(color, 0.28);
  const light = lightenHex(color, 0.22);

  const cx = w * 0.54;   // body centre x
  const cy = h * 0.60;   // body centre y
  const rx = w * 0.26;   // body x-radius
  const ry = h * 0.32;   // body y-radius

  const tailPath = [
    `M ${w*0.28},${cy - ry*0.45}`,
    `C ${w*0.18},${cy - ry*0.9}  ${w*0.05},${h*0.10}  ${w*0.02},${h*0.06}`,
    `C ${w*0.08},${h*0.38}  ${w*0.15},${h*0.53}  ${w*0.15},${cy}`,
    `C ${w*0.15},${h - h*0.53}  ${w*0.08},${h - h*0.38}  ${w*0.02},${h*0.94}`,
    `C ${w*0.05},${h*0.90}  ${w*0.18},${cy + ry*0.9}  ${w*0.28},${cy + ry*0.45}`,
    'Z',
  ].join(' ');

  const dorsalPath = [
    `M ${cx - rx*0.15},${cy - ry}`,
    `C ${cx + rx*0.05},${cy - ry*2.1}  ${cx + rx*0.25},${cy - ry*2.1}  ${cx + rx*0.42},${cy - ry}`,
    'Z',
  ].join(' ');

  const pectoralPath = [
    `M ${cx + rx*0.02},${cy + ry*0.15}`,
    `C ${cx + rx*0.35},${cy + ry*1.4}  ${cx + rx*0.72},${cy + ry*1.25}  ${cx + rx*0.55},${cy + ry*0.5}`,
    'Z',
  ].join(' ');

  /* Eye (on the head/right side) */
  const ex = cx + rx * 0.52;
  const ey = cy - ry * 0.22;
  const er = w * 0.048;

  /* Label centred on body; x adjusts for the graphic flip */
  const fontSize = w * 0.21;
  const textX    = facingRight ? (cx - rx * 0.3) : (w - cx + rx * 0.3);
  const textY    = cy + fontSize * 0.38;

  /* Flip only the graphics group, not the text */
  const flipAttr = facingRight ? '' : `transform="scale(-1,1) translate(-${w},0)"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <g ${flipAttr}>
      <path d="${tailPath}" fill="${dark}"/>
      <path d="${dorsalPath}" fill="${dark}" opacity="0.85"/>
      <path d="${pectoralPath}" fill="${dark}" opacity="0.75"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}"/>
      <ellipse cx="${cx + rx*0.04}" cy="${cy - ry*0.32}" rx="${rx*0.52}" ry="${ry*0.33}" fill="${light}" opacity="0.3"/>
      <circle cx="${ex}" cy="${ey}" r="${er*1.35}" fill="white"/>
      <circle cx="${ex + er*0.2}" cy="${ey}" r="${er*0.72}" fill="#1a1a2e"/>
      <circle cx="${ex + er*0.04}" cy="${ey - er*0.42}" r="${er*0.28}" fill="white" opacity="0.9"/>
    </g>
    <text x="${textX}" y="${textY}" text-anchor="middle"
      font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="${fontSize}px"
      fill="rgba(255,255,255,0.95)"
      stroke="rgba(0,0,0,0.55)" stroke-width="2.5" paint-order="stroke">${label.toUpperCase()}</text>
  </svg>`;
}

function darkenHex(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) * (1 - amount));
  const g = Math.max(0, ((n >> 8)  & 0xff) * (1 - amount));
  const b = Math.max(0, ( n        & 0xff) * (1 - amount));
  return `rgb(${r|0},${g|0},${b|0})`;
}

function lightenHex(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + 255 * amount);
  const g = Math.min(255, ((n >> 8)  & 0xff) + 255 * amount);
  const b = Math.min(255, ( n        & 0xff) + 255 * amount);
  return `rgb(${r|0},${g|0},${b|0})`;
}

function spawnFish(label) {
  const color    = pickColor();
  const size     = randomBetween(90, 160);
  const goRight  = Math.random() > 0.5;
  const yMin     = size * 0.6;
  const yMax     = window.innerHeight - 70 - size * 0.7;
  const yPos     = randomBetween(yMin, yMax);
  const duration = randomBetween(7, 16);
  const bobPeriod= randomBetween(1.8, 3.2);

  const fish = document.createElement('div');
  fish.className = 'fish';
  fish.style.cssText = `
    top: ${yPos}px;
    ${goRight ? `left: -${size + 20}px` : `right: -${size + 20}px`};
    animation:
      ${goRight ? 'swim-right' : 'swim-left'} ${duration}s linear forwards,
      bob ${bobPeriod}s ease-in-out infinite;
  `;

  fish.innerHTML = makeFishSVG(color, size, label, goRight);
  fishLayer.appendChild(fish);

  /* bubbles near the mouth (head side) */
  const mouthX = goRight
    ? size * 0.54 + size * 0.26   // right edge of body when going right
    : window.innerWidth - (size * 0.54 + size * 0.26);
  for (let i = 0; i < (randomBetween(2, 5) | 0); i++) {
    spawnBubble(mouthX, yPos + size * 0.2, randomBetween(6, 18));
  }

  fish.addEventListener('animationend', (e) => {
    if (e.animationName === 'swim-right' || e.animationName === 'swim-left') {
      fish.remove();
    }
  });
}

function spawnBubble(x, y, r) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  const duration = randomBetween(3, 6);
  bubble.style.cssText = `
    left: ${x + randomBetween(-20, 20)}px;
    top:  ${y}px;
    width: ${r * 2}px;
    height: ${r * 2}px;
    animation-name: rise;
    animation-duration: ${duration}s;
    animation-timing-function: ease-in;
  `;
  bubblesLayer.appendChild(bubble);
  bubble.addEventListener('animationend', () => bubble.remove());
}

let audioCtx = null;

function playBubbleSound() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const ctx = audioCtx;
  const now = ctx.currentTime;

  /* Sine oscillator sweeping upward — classic water-bubble pitch */
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();

  /* Slight low-pass to soften high-frequency harshness */
  const filter = ctx.createBiquadFilter();
  filter.type            = 'lowpass';
  filter.frequency.value = 1800;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const startFreq = randomBetween(180, 320);
  const endFreq   = startFreq * randomBetween(2.2, 3.5);
  const duration  = randomBetween(0.12, 0.22);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.start(now);
  osc.stop(now + duration + 0.01);
}

function getLabel(e) {
  if (e.key.length === 1) return e.key;
  const aliases = {
    ' ': '␣', Enter: '↵', Backspace: '⌫', Tab: '⇥',
    ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→',
    Escape: 'Esc', Shift: '⇧', Control: 'Ctrl', Alt: 'Alt', Meta: '⌘',
  };
  return aliases[e.key] || e.key.slice(0, 3);
}

document.addEventListener('keydown', (e) => {
  if (e.repeat) return;

  if (hintVisible) {
    hint.classList.add('hidden');
    hintVisible = false;
  }

  playBubbleSound();
  spawnFish(getLabel(e));
});
