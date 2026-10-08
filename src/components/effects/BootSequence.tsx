'use client';
import { useEffect, useRef } from 'react';
import { motionReduced } from '@/lib/motion';
export function BootSequence() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (motionReduced()) return;
    try {
      if (sessionStorage.getItem('portfolio-boot')) return;
      sessionStorage.setItem('portfolio-boot', '1');
    } catch {
      /* Private mode still receives a brief, non-blocking introduction. */
    }
    const el = ref.current;
    if (!el) return;
    el.hidden = false;
    const hide = () => {
      el.hidden = true;
    };
    const timer = setTimeout(hide, 1350);
    document.addEventListener('keydown', hide, { once: true });
    document.addEventListener('pointerdown', hide, { once: true });
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', hide);
      document.removeEventListener('pointerdown', hide);
    };
  }, []);
  return (
    <div ref={ref} className="boot" hidden aria-hidden="true">
      <div>
        <pre>
          <span>
            <b>PRE-FLIGHT</b> checklist
          </span>
          <span>[ OK ] identity ........ gowtham</span>
          <span>[ OK ] cloud ........... aws</span>
          <span>[ OK ] pipelines ....... green</span>
          <span>
            <b>IGNITION</b>
          </span>
        </pre>
        <div className="boot-progress">
          <i />
        </div>
      </div>
    </div>
  );
}
