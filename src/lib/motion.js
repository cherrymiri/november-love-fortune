export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

/** element.animate(...).finished, 실패해도 멈추지 않도록 */
export function run(el, keyframes, options) {
  if (!el || !el.animate) return Promise.resolve();
  const a = el.animate(keyframes, options);
  return a.finished.catch(() => {}).then(() => a);
}
