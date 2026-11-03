import { CRT_PRESETS, resolveInitialCrtPreset, saveCrtPresetPreference } from './preferences.js';

let cachedBarrelMapUri = null;
let barrelMapMounted = false;

/**
 * Generates the 1024x1024 ordered-dithered separable CRT-Lottes barrel displacement map.
 * Memoized so the canvas pass runs at most once per page session.
 */
export function generateCrtBarrelMap() {
  if (cachedBarrelMapUri) return cachedBarrelMapUri;

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Bayer 4x4 matrix for ordered dither to prevent 8-bit quantization banding
  const bayer = [
    [0 / 16, 8 / 16, 2 / 16, 10 / 16],
    [12 / 16, 4 / 16, 14 / 16, 6 / 16],
    [3 / 16, 11 / 16, 1 / 16, 9 / 16],
    [15 / 16, 7 / 16, 13 / 16, 5 / 16]
  ];

  // Separable CRT-Lottes Warp Model:
  // dx depends on ny^2, dy depends on nx^2.
  const warpX = 0.065;
  const warpY = 0.08;
  const maxDisp = 0.1;

  for (let y = 0; y < size; y++) {
    const ny = (y / (size - 1)) * 2 - 1;
    const ny2 = ny * ny;
    const bRow = bayer[y & 3];

    for (let x = 0; x < size; x++) {
      const nx = (x / (size - 1)) * 2 - 1;
      const nx2 = nx * nx;

      const dx = nx * ny2 * warpX;
      const dy = ny * nx2 * warpY;

      const dither = bRow[x & 3] - 0.5;
      const rVal = Math.round(128 + (dx / maxDisp) * 127 + dither);
      const gVal = Math.round(128 + (dy / maxDisp) * 127 + dither);

      const idx = (y * size + x) * 4;
      data[idx] = Math.max(0, Math.min(255, rVal));
      data[idx + 1] = Math.max(0, Math.min(255, gVal));
      data[idx + 2] = 128;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  cachedBarrelMapUri = canvas.toDataURL('image/png');
  return cachedBarrelMapUri;
}

function ensureBarrelMapMounted() {
  if (barrelMapMounted) return;
  try {
    const feImg = document.getElementById('fe-crt-barrel-map');
    if (!feImg) return;
    const mapUri = generateCrtBarrelMap();
    feImg.setAttribute('href', mapUri);
    feImg.setAttribute('preserveAspectRatio', 'none');
    barrelMapMounted = true;
  } catch (err) {
    console.warn('CRT barrel map generation error:', err);
  }
}

export function createCrtController({ tvElement, onToggleSound }) {
  let currentPreset = 'authentic';

  function updateCrtScale() {
    const feDisp = document.getElementById('fe-crt-disp');
    if (feDisp) {
      const isMobile = window.innerWidth <= 760;
      feDisp.setAttribute('scale', isMobile ? '8' : '14');
    }
  }

  function applyPreset(preset, save = true) {
    const normalized = CRT_PRESETS.includes(preset) ? preset : 'authentic';
    currentPreset = normalized;

    if (normalized === 'authentic') {
      ensureBarrelMapMounted();
    }

    if (save) {
      saveCrtPresetPreference(normalized);
    }

    tvElement.classList.remove('tv-crt-authentic', 'tv-crt-performance', 'tv-crt-off');
    tvElement.classList.add(`tv-crt-${normalized}`);

    const label = document.getElementById('crt-preset-label');
    if (label) label.textContent = normalized.toUpperCase();

    const btn = document.getElementById('crt-preset-toggle');
    if (btn) {
      btn.setAttribute('aria-label', `CRT Quality Preset: ${normalized}`);
    }

    updateCrtScale();
  }

  function cyclePreset() {
    const nextIdx = (CRT_PRESETS.indexOf(currentPreset) + 1) % CRT_PRESETS.length;
    applyPreset(CRT_PRESETS[nextIdx], true);
    onToggleSound?.();
  }

  function init() {
    const initialPreset = resolveInitialCrtPreset(window.location.search);
    applyPreset(initialPreset, false);

    // If starting in performance/off, pre-warm barrel map idly only if user might toggle later
    if (initialPreset !== 'authentic' && typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => {
        try {
          generateCrtBarrelMap();
        } catch {
          // Ignore background warmup failures
        }
      });
    }

    const btn = document.getElementById('crt-preset-toggle');
    btn?.addEventListener('click', cyclePreset);
    window.addEventListener('resize', updateCrtScale);
  }

  return {
    init,
    applyPreset,
    cyclePreset,
    getPreset: () => currentPreset
  };
}
