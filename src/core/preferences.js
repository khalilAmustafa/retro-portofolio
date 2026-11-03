export const CRT_PRESETS = ['authentic', 'performance', 'off'];
const STORAGE_KEY = 'khalil_crt_preset';

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function resolveInitialCrtPreset(searchString = '') {
  let preset = 'authentic';

  try {
    const urlParam = new URLSearchParams(searchString).get('preset');
    if (urlParam && CRT_PRESETS.includes(urlParam.toLowerCase())) {
      return urlParam.toLowerCase();
    }
  } catch {
    // Ignore malformed query strings
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && CRT_PRESETS.includes(stored)) {
        preset = stored;
      }
    }
  } catch {
    // Ignore storage privacy restrictions
  }

  if (prefersReducedMotion() && preset === 'authentic') {
    return 'performance';
  }

  return preset;
}

export function saveCrtPresetPreference(preset) {
  if (!CRT_PRESETS.includes(preset)) return;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, preset);
    }
  } catch {
    // Ignore storage privacy restrictions
  }
}
