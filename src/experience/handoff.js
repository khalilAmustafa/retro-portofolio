import gsap from 'gsap';
export const SHELL_WIDTH = 1560;
export const SHELL_HEIGHT = 1000;
export function calculateTvFit({ width, height }, aspect = SHELL_WIDTH / SHELL_HEIGHT, inset = 20) {
  const availableWidth = Math.max(1, width - inset * 2);
  const availableHeight = Math.max(1, height - inset * 2);
  const w = Math.min(availableWidth, availableHeight * aspect);
  const h = w / aspect;
  return { x: (width - w)/2, y: (height - h)/2, width: w, height: h };
}
export function projectTvRect(viewport, physical, distance, fov) {
  const pixelsPerUnit = viewport.height / (2 * Math.tan(fov * Math.PI / 360) * distance);
  const width = physical.width * pixelsPerUnit;
  const height = physical.height * pixelsPerUnit;
  return { x: (viewport.width-width)/2, y: (viewport.height-height)/2, width, height };
}
export function createHandoff({ room, shell, reducedMotion, onSettled }) {
  const motion = { progress: 0 };
  let tween, target = 0, disposed = false;
  function update() {
    room?.setProgress(motion.progress);
    const blend = Math.max(0, Math.min(1, (motion.progress - .85)/.15));
    shell.style.opacity = blend;
    shell.style.visibility = blend > 0 ? 'visible' : 'hidden';
    shell.inert = target === 0 || motion.progress < .999;
    shell.setAttribute('aria-hidden', String(shell.inert));
    document.documentElement.style.setProperty('--entered', motion.progress);
  }
  function resize() {
    const viewport = { width: innerWidth, height: innerHeight };
    const compact = viewport.width < 1000;
    const rect = compact ? { x: 6, y: 68, width: viewport.width-12, height: viewport.height-88 }
      : calculateTvFit(viewport, SHELL_WIDTH/SHELL_HEIGHT, 20);
    shell.dataset.compact = String(compact);
    shell.style.width = `${compact ? rect.width : SHELL_WIDTH}px`;
    shell.style.height = `${compact ? rect.height : SHELL_HEIGHT}px`;
    shell.style.left = `${rect.x}px`;
    shell.style.top = `${rect.y}px`;
    shell.style.transform = compact ? 'none' : `scale(${rect.width/SHELL_WIDTH})`;
    shell.style.setProperty('--shell-scale',compact?1:rect.width/SHELL_WIDTH);
    room?.resize(rect);
    update();
  }
  function setTarget(next, immediate = false) {
    if (disposed) return;
    target = next;
    tween?.kill();
    if (next === 0 && shell.contains(document.activeElement)) document.activeElement.blur();
    room?.setActive(true);
    const duration = immediate || reducedMotion.matches ? 0 : Math.max(.25, Math.abs(next-motion.progress)*1.2);
    tween = gsap.to(motion, { progress: next, duration, ease: 'power2.inOut', overwrite: true,
      onUpdate: update, onComplete: () => {
        update();
        room?.setActive(next === 0);
        onSettled?.(next);
      } });
  }
  window.addEventListener('resize', resize);
  const changeMotion = () => setTarget(target, true);
  reducedMotion.addEventListener('change', changeMotion);
  resize();
  return { setTarget, resize, getProgress: () => motion.progress, dispose() {
    disposed = true; tween?.kill(); window.removeEventListener('resize',resize);
    reducedMotion.removeEventListener('change',changeMotion);
  } };
}
