export function createSoundController() {
  let volume = 0;
  let audioCtx = null;

  function getVolume() {
    return volume;
  }

  function setVolume(nextValue) {
    const parsed = Number(nextValue);
    if (Number.isNaN(parsed)) return volume;
    volume = Math.max(0, Math.min(100, Math.round(parsed)));
    return volume;
  }

  function ensureCtx() {
    if (!volume || typeof window === 'undefined') return null;
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return null;
    audioCtx ??= new AudioContextCtor();
    audioCtx.resume().catch(() => {});
    return audioCtx;
  }

  function playTone({ type = 'triangle', startFreq = 520, endFreq = 180, duration = 0.065, gainScale = 0.12, delay = 0 }) {
    try {
      const ctx = ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), now + duration);

      const peak = Math.max(0.002, (volume / 100) * gainScale);
      gain.gain.setValueAtTime(peak, now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration + 0.012);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.016);
    } catch {
      // Audio playback blocked or unavailable
    }
  }

  function clickSound(isPower = false) {
    if (isPower) {
      playTone({ type: 'sine', startFreq: 190, endFreq: 55, duration: 0.08, gainScale: 0.16 });
    } else {
      playTone({ type: 'triangle', startFreq: 680, endFreq: 120, duration: 0.055, gainScale: 0.13 });
      playTone({ type: 'square', startFreq: 1120, endFreq: 420, duration: 0.028, gainScale: 0.04, delay: 0.02 });
    }
  }

  function uiTap() {
    playTone({ type: 'triangle', startFreq: 860, endFreq: 340, duration: 0.036, gainScale: 0.08 });
  }

  function visionTalk() {
    playTone({ type: 'square', startFreq: 540, endFreq: 690, duration: 0.045, gainScale: 0.06 });
    playTone({ type: 'square', startFreq: 760, endFreq: 920, duration: 0.045, gainScale: 0.055, delay: 0.055 });
  }

  function successChime() {
    playTone({ type: 'triangle', startFreq: 523.25, endFreq: 530, duration: 0.07, gainScale: 0.1 });
    playTone({ type: 'triangle', startFreq: 783.99, endFreq: 790, duration: 0.11, gainScale: 0.11, delay: 0.065 });
  }

  function scanBeep(stepIdx = 0) {
    const base = 440 + stepIdx * 110;
    playTone({ type: 'sine', startFreq: base, endFreq: base * 1.08, duration: 0.06, gainScale: 0.085 });
  }

  return {
    getVolume,
    setVolume,
    clickSound,
    uiTap,
    visionTalk,
    successChime,
    scanBeep
  };
}
