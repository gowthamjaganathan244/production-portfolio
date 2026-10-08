'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { EnhancementBoundary } from '@/components/ui/EnhancementBoundary';
const HyperdriveCanvas = dynamic(
  () => import('./HyperdriveCanvas').then((module) => module.HyperdriveCanvas),
  { ssr: false },
);
export function DeferredEffects() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(() => setReady(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(handle);
  }, []);
  return ready ? (
    <EnhancementBoundary>
      <HyperdriveCanvas />
    </EnhancementBoundary>
  ) : null;
}
