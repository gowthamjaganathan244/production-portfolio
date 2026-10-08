'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { EnhancementBoundary } from '@/components/ui/EnhancementBoundary';
const SecurityLab = dynamic(() => import('./SecurityLab').then((module) => module.SecurityLab), {
  loading: () => (
    <p className="lab-loading" role="status">
      Initializing browser sandbox…
    </p>
  ),
});
export function SecurityLabLoader() {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return; // The initialize button remains available.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px' },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="card lab-shell">
      {ready ? (
        <EnhancementBoundary
          fallback={
            <p className="lab-loading" role="status">
              The browser sandbox could not load. Reload the page to retry. All portfolio content
              remains available.
            </p>
          }
        >
          <SecurityLab />
        </EnhancementBoundary>
      ) : (
        <div className="lab-loading">
          <p>Terminal · Capture the flag · Password lab · Hash and decode</p>
          <button className="btn ghost" onClick={() => setReady(true)}>
            Initialize sandbox
          </button>
        </div>
      )}
      <noscript>
        <p className="pane">
          This interactive browser sandbox requires JavaScript. All portfolio information is
          available above and below.
        </p>
      </noscript>
    </div>
  );
}
