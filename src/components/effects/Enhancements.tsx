'use client';
import { useEffect } from 'react';
import { motionReduced, observeMotion } from '@/lib/motion';
export function Enhancements() {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || !('ResizeObserver' in window)) return;
    const cleanups: (() => void)[] = [];
    const resetPointers: (() => void)[] = [];
    const animations = new Set<Animation>();
    const frames = new Set<number>();
    const motionRegions = document.querySelectorAll('.hero, .ticker, .project-card, #contact');
    const visibility = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) =>
          entry.target.classList.toggle('motion-offscreen', !entry.isIntersecting),
        ),
      { rootMargin: '150px' },
    );
    motionRegions.forEach((el) => visibility.observe(el));
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add('in-view');
          if (!motionReduced()) {
            const a = el.animate(
              [
                { opacity: 0.45, translate: '0 20px' },
                { opacity: 1, translate: '0 0' },
              ],
              { duration: 500, easing: 'cubic-bezier(.2,.7,.2,1)' },
            );
            animations.add(a);
            a.onfinish = () => animations.delete(a);
          }
          reveal.unobserve(el);
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));
    const counters = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          counters.unobserve(entry.target);
          const el = entry.target as HTMLElement,
            value = Number(el.dataset.count),
            suffix = el.dataset.suffix ?? '',
            start = performance.now();
          const tick = (now: number) => {
            const progress = motionReduced() ? 1 : Math.min(1, (now - start) / 1000);
            const text = `${Math.round(value * (1 - (1 - progress) ** 3))}${suffix}`;
            if (el.textContent !== text) el.textContent = text;
            if (progress < 1) {
              const frame = requestAnimationFrame((t) => {
                frames.delete(frame);
                tick(t);
              });
              frames.add(frame);
            }
          };
          tick(start);
        }),
      { threshold: 0.5 },
    );
    document.querySelectorAll('[data-count]').forEach((el) => counters.observe(el));
    const bar = document.querySelector<HTMLElement>('.scroll-progress');
    const timeline = document.querySelector<HTMLElement>('.timeline');
    const fill = document.querySelector<HTMLElement>('.timeline-fill');
    let scrollFrame = 0;
    const update = () => {
      scrollFrame = 0;
      const distance = document.documentElement.scrollHeight - innerHeight;
      // Complete layout reads before style writes to avoid forced synchronous layout.
      const rect = timeline && fill ? timeline.getBoundingClientRect() : null;
      if (bar) bar.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
      if (rect && fill) {
        fill.style.transform = `scaleY(${Math.max(0, Math.min(1, (innerHeight * 0.65 - rect.top) / rect.height))})`;
      }
    };
    const schedule = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    update();
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    document.querySelectorAll<HTMLElement>('.card, .magnetic').forEach((el) => {
      let frame = 0,
        x = 0,
        y = 0;
      const move = (event: PointerEvent) => {
        if (!fine.matches || motionReduced() || event.pointerType === 'touch') return;
        x = event.clientX;
        y = event.clientY;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const r = el.getBoundingClientRect(),
            dx = (x - r.left) / r.width - 0.5,
            dy = (y - r.top) / r.height - 0.5;
          el.style.setProperty('--mx', `${x - r.left}px`);
          el.style.setProperty('--my', `${y - r.top}px`);
          if (el.classList.contains('magnetic'))
            el.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`;
          else if (el.hasAttribute('data-tilt'))
            el.style.transform = `perspective(1000px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
        });
      };
      const reset = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        el.style.transform = '';
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', reset);
      resetPointers.push(reset);
      cleanups.push(() => {
        reset();
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', reset);
      });
    });
    const pause = () => {
      document.documentElement.classList.toggle('tab-hidden', document.hidden);
      const reduced = motionReduced();
      if (reduced || document.hidden || !fine.matches) resetPointers.forEach((reset) => reset());
      animations.forEach((a) => {
        if (reduced) a.finish();
        else if (document.hidden) a.pause();
        else if (a.playState === 'paused') a.play();
      });
    };
    pause();
    const stopMotion = observeMotion(pause);
    document.addEventListener('visibilitychange', pause);
    fine.addEventListener('change', pause);
    return () => {
      visibility.disconnect();
      motionRegions.forEach((el) => el.classList.remove('motion-offscreen'));
      reveal.disconnect();
      counters.disconnect();
      resize.disconnect();
      cancelAnimationFrame(scrollFrame);
      frames.forEach(cancelAnimationFrame);
      animations.forEach((a) => a.cancel());
      cleanups.forEach((fn) => fn());
      stopMotion();
      document.removeEventListener('visibilitychange', pause);
      fine.removeEventListener('change', pause);
      document.documentElement.classList.remove('tab-hidden');
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
    };
  }, []);
  return <div className="scroll-progress" aria-hidden="true" />;
}
