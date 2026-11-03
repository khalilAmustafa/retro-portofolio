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

  function clickSound(isPower = false) {
    if (!volume || typeof window === 'undefined') return;
    try {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) return;
      audioCtx ??= new AudioContextCtor();
      audioCtx.resume().catch(() => {});

      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      oscillator.type = isPower ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(isPower ? 180 : 650, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        isPower ? 60 : 110,
        audioCtx.currentTime + 0.055
      );
      gain.gain.setValueAtTime((volume / 100) * 0.13, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);

      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.08);
    } catch {
      // Audio playback blocked or unavailable
    }
  }

  return {
    getVolume,
    setVolume,
    clickSound
  };
}
