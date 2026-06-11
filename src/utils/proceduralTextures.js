import * as THREE from 'three';

// Canvas-generated textures so the 3D scene needs no external asset files.
// Each texture is built once and cached.
const cache = {};

function canvasTexture(key, size, draw, { srgb = false } = {}) {
  if (cache[key]) return cache[key];
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  cache[key] = tex;
  return tex;
}

// Fine speckle used as a bump map to give balls a pebbled, non-plastic surface.
export function pebbleBump() {
  return canvasTexture('pebble', 512, (ctx, s) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 11000; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const r = Math.random() * 1.7;
      const g = 70 + Math.floor(Math.random() * 110);
      ctx.fillStyle = `rgb(${g},${g},${g})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// Full basketball color map drawn equirectangular: orange leather, pebble grain,
// and the authentic seam layout (one equator, one meridian, two curved side
// seams) rather than a symmetric grid of great circles.
export function basketballTexture() {
  if (cache.basketball) return cache.basketball;
  const w = 2048;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Base leather color.
  ctx.fillStyle = '#c0601f';
  ctx.fillRect(0, 0, w, h);

  // Pebbled grain (light + dark speckle).
  for (let i = 0; i < 60000; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 1.7;
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(86,38,12,0.22)' : 'rgba(255,196,140,0.16)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Seams.
  ctx.strokeStyle = '#150d07';
  ctx.lineWidth = h * 0.013;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw a near-vertical seam following x = f(y) from pole to pole.
  const seam = (xFn) => {
    ctx.beginPath();
    for (let y = 0; y <= h; y += 3) {
      const x = xFn(y);
      if (y === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // Equator (continuous horizontal line).
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // Meridian great circle: front half (center) + back half (both edges).
  seam(() => w * 0.5);
  seam(() => 1);
  seam(() => w - 1);

  // Two curved side seams, bowing outward away from the meridian.
  const A = w * 0.06;
  seam((y) => w * 0.25 - A * Math.sin((Math.PI * y) / h));
  seam((y) => w * 0.75 + A * Math.sin((Math.PI * y) / h));

  // Two more curved seams flanking the front meridian (also bowing outward).
  const B = w * 0.045;
  seam((y) => w * 0.375 - B * Math.sin((Math.PI * y) / h));
  seam((y) => w * 0.625 + B * Math.sin((Math.PI * y) / h));

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  cache.basketball = tex;
  return tex;
}

// Dense hex-packed dimples for a golf ball, used as a bump map.
export function dimpleBump() {
  return canvasTexture('dimple', 1024, (ctx, s) => {
    ctx.fillStyle = '#cfcfcf';
    ctx.fillRect(0, 0, s, s);
    const step = s / 34;
    const r = step * 0.47;
    for (let row = 0; row * (step * 0.87) <= s + step; row++) {
      const y = row * step * 0.87;
      const offset = (row % 2) * (step / 2);
      for (let x = -step; x <= s + step; x += step) {
        const grd = ctx.createRadialGradient(x + offset, y, 0, x + offset, y, r);
        grd.addColorStop(0, '#2e2e2e');
        grd.addColorStop(0.75, '#9a9a9a');
        grd.addColorStop(1, '#dcdcdc');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x + offset, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}

// Crosshatch string bed for the racket face. Transparent between strings so it
// reads as a real string pattern when used with alphaTest.
export function stringTexture() {
  return canvasTexture(
    'strings',
    512,
    (ctx, s) => {
      ctx.clearRect(0, 0, s, s);
      ctx.strokeStyle = 'rgba(238,238,238,0.9)';
      ctx.lineWidth = 3.5;
      const n = 17;
      for (let i = 1; i < n; i++) {
        const p = (i / n) * s;
        ctx.beginPath();
        ctx.moveTo(p, 0);
        ctx.lineTo(p, s);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, p);
        ctx.lineTo(s, p);
        ctx.stroke();
      }
    },
    { srgb: true }
  );
}
