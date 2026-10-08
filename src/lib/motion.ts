let motionQuery: MediaQueryList | undefined;
const reducedMotionQuery = () => (motionQuery ??= matchMedia('(prefers-reduced-motion: reduce)'));
export const motionReduced = () =>
  reducedMotionQuery().matches || document.documentElement.dataset.motion === 'paused';
export function observeMotion(callback: () => void) {
  const media = reducedMotionQuery();
  media.addEventListener('change', callback);
  document.addEventListener('motionchange', callback);
  return () => {
    media.removeEventListener('change', callback);
    document.removeEventListener('motionchange', callback);
  };
}
