'use client';
import { useEffect } from 'react';
import { roles } from '@/data/portfolio';
import { motionReduced, observeMotion } from '@/lib/motion';
export function RoleScrambler() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-role]');
    const glyphs = '01<>/{}[]#$%&*+=';
    const timer = document.querySelector<HTMLElement>('.role-timer i');
    let visible = true;
    const restartTimer = () => {
      // Restart on the same clock as the role after visibility/motion changes.
      timer?.getAnimations().forEach((animation) => {
        animation.currentTime = 0;
      });
    };
    let index = 0,
      interval: ReturnType<typeof setInterval> | undefined,
      frame = 0;
    const set = (value: string) =>
      targets.forEach((el) => {
        el.textContent = value;
      });
    const rotate = () => {
      index = (index + 1) % roles.length;
      const to = roles[index],
        start = performance.now();
      const animate = (now: number) => {
        const p = Math.min(1, (now - start) / 704);
        set(
          [...to]
            .map((c, i) =>
              i < to.length * p || c === ' '
                ? c
                : glyphs[Math.floor(Math.random() * glyphs.length)],
            )
            .join(''),
        );
        if (p < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    };
    const sync = () => {
      clearInterval(interval);
      cancelAnimationFrame(frame);
      set(roles[index]);
      restartTimer();
      if (visible && !document.hidden && !motionReduced()) interval = setInterval(rotate, 10000);
    };
    const hero = document.querySelector('.hero');
    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => {
            if (visible === entry.isIntersecting) return;
            visible = entry.isIntersecting;
            sync();
          })
        : null;
    if (hero) observer?.observe(hero);
    sync();
    document.addEventListener('visibilitychange', sync);
    const stopMotion = observeMotion(sync);
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(frame);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', sync);
      stopMotion();
    };
  }, []);
  return null;
}
