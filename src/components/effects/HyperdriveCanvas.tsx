'use client';
import { useEffect, useRef } from 'react';
import { motionReduced, observeMotion } from '@/lib/motion';
import { HyperdriveField } from '@/lib/hyperdrive';
export function HyperdriveCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = canvas.current,
      cursor = ring.current;
    const ctx = el?.getContext('2d', { alpha: true });
    if (!el || !ctx) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const coarse = matchMedia('(pointer: coarse)');
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    // Keep every star and the original motion; reduce only backing-store pixels.
    const constrained =
      (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4) ||
      (device.deviceMemory !== undefined && device.deviceMemory <= 4) ||
      device.connection?.saveData === true;
    const pixelRatio = () =>
      Math.min(devicePixelRatio || 1, constrained ? 1 : coarse.matches ? 1.5 : 2);
    const field = new HyperdriveField(Math.random, scrollY);
    let frame = 0;
    let renderedDpr = 0;
    let viewportWidth = 0,
      viewportHeight = 0,
      resizeFrame = 0;
    let mx = 0,
      my = 0;
    let tx = 0,
      ty = 0,
      rx = 0,
      ry = 0,
      inside = false;
    const draw = (still = false) => {
      field.draw(ctx, scrollY, fine.matches ? mx : 0, fine.matches ? my : 0, still);
      if (cursor && fine.matches && inside && !still) {
        rx += (tx - rx) * 0.2;
        ry += (ty - ry) * 0.2;
        cursor.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
    };
    const loop = () => {
      // Some display/emulation changes update DPR without dispatching resize/media events.
      if (pixelRatio() !== renderedDpr) size();
      // Match the original per-frame stepping, including high-refresh displays.
      draw();
      frame = requestAnimationFrame(loop);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      field.resume(scrollY);
      if (motionReduced()) {
        cursor?.classList.remove('visible');
        draw(true);
      } else if (!document.hidden) frame = requestAnimationFrame(loop);
    };
    const size = () => {
      const dpr = pixelRatio();
      if (dpr === renderedDpr && innerWidth === viewportWidth && innerHeight === viewportHeight)
        return;
      renderedDpr = dpr;
      viewportWidth = innerWidth;
      viewportHeight = innerHeight;
      el.width = innerWidth * dpr;
      el.height = innerHeight * dpr;
      el.style.width = `${innerWidth}px`;
      el.style.height = `${innerHeight}px`;
      field.resize(innerWidth, innerHeight, dpr);
      // Resizing changes geometry, not the source's accumulated scroll velocity.
      if (motionReduced()) draw(true);
    };
    const scheduleSize = () => {
      if (!resizeFrame)
        resizeFrame = requestAnimationFrame(() => {
          resizeFrame = 0;
          size();
        });
    };
    const pointer = (event: PointerEvent) => {
      if (!fine.matches || motionReduced() || event.pointerType === 'touch') return;
      tx = event.clientX;
      ty = event.clientY;
      mx = tx / innerWidth - 0.5;
      my = ty / innerHeight - 0.5;
      if (!inside) {
        rx = tx;
        ry = ty;
        inside = true;
      }
      cursor?.classList.add('visible');
      cursor?.classList.toggle(
        'expanded',
        event.target instanceof Element &&
          !!event.target.closest('a, button, input, textarea, select, [role="option"]'),
      );
    };
    const leave = () => {
      inside = false;
      cursor?.classList.remove('visible');
    };
    let resolution: MediaQueryList;
    const watchResolution = () => {
      resolution?.removeEventListener('change', resolutionChanged);
      resolution = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
      resolution.addEventListener('change', resolutionChanged);
    };
    const resolutionChanged = () => {
      size();
      watchResolution();
    };
    size();
    watchResolution();
    if (!motionReduced() && !document.hidden) frame = requestAnimationFrame(loop);
    const stopMotion = observeMotion(sync);
    addEventListener('resize', scheduleSize);
    coarse.addEventListener('change', scheduleSize);
    document.addEventListener('visibilitychange', sync);
    document.addEventListener('pointermove', pointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    addEventListener('blur', leave);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      resolution.removeEventListener('change', resolutionChanged);
      stopMotion();
      removeEventListener('resize', scheduleSize);
      coarse.removeEventListener('change', scheduleSize);
      document.removeEventListener('visibilitychange', sync);
      document.removeEventListener('pointermove', pointer);
      document.documentElement.removeEventListener('pointerleave', leave);
      removeEventListener('blur', leave);
    };
  }, []);
  return (
    <>
      <canvas className="hyperdrive" ref={canvas} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
    </>
  );
}
