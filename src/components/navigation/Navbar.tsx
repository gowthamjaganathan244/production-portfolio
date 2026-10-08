'use client';
import { useEffect, useRef, useState } from 'react';
import { navigation } from '@/data/portfolio';
import { CommandPalette } from './CommandPalette';
export function Navbar() {
  const [active, setActive] = useState('top');
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const mobile = useRef<HTMLDialogElement>(null);
  const navbar = useRef<HTMLElement>(null);
  useEffect(() => {
    let measureFrame = 0;
    const measure = () => {
      cancelAnimationFrame(measureFrame);
      measureFrame = requestAnimationFrame(() => {
        if (navbar.current) {
          const value = `${navbar.current.getBoundingClientRect().bottom}px`;
          if (document.documentElement.style.getPropertyValue('--nav-bottom') !== value)
            document.documentElement.style.setProperty('--nav-bottom', value);
        }
      });
    };
    const sizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (navbar.current) sizeObserver?.observe(navbar.current);
    measure();
    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
            },
            { rootMargin: '-15% 0px -60% 0px', threshold: 0 },
          )
        : null;
    navigation.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer?.observe(el);
    });
    const keydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        mobile.current?.close();
        setMenuOpen(false);
        setPaletteOpen((value) => !value);
      }
    };
    const desktop = matchMedia('(min-width: 1000px)');
    const resize = () => {
      if (desktop.matches) {
        mobile.current?.close();
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', keydown);
    desktop.addEventListener('change', resize);
    return () => {
      sizeObserver?.disconnect();
      cancelAnimationFrame(measureFrame);
      observer?.disconnect();
      document.removeEventListener('keydown', keydown);
      desktop.removeEventListener('change', resize);
    };
  }, []);
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);
  const links = navigation.map((item) => (
    <a
      key={item.id}
      href={`#${item.id}`}
      aria-current={active === item.id ? 'location' : undefined}
      onClick={() => {
        mobile.current?.close();
        setMenuOpen(false);
      }}
    >
      {item.label}
    </a>
  ));
  const toggleMotion = () => {
    const next = !paused;
    setPaused(next);
    document.documentElement.dataset.motion = next ? 'paused' : 'running';
    document.dispatchEvent(new Event('motionchange'));
  };
  return (
    <>
      <nav ref={navbar} className="navbar" aria-label="Main navigation">
        <div className="desktop-links">{links}</div>
        <a className="mobile-brand" href="#top">
          <span aria-hidden="true">●</span> GJ / SYSTEM
        </a>
        <button
          className="command-trigger"
          onClick={(event) => {
            event.currentTarget.focus();
            setPaletteOpen(true);
          }}
          aria-label="Open command console (⌘ K)"
          aria-keyshortcuts="Control+k Meta+k"
        >
          <span aria-hidden="true">⌘ K</span>
        </button>
        <button
          className="motion-trigger"
          onClick={toggleMotion}
          aria-pressed={paused}
          aria-label={paused ? 'Resume decorative motion' : 'Pause decorative motion'}
        >
          {paused ? '▷' : 'Ⅱ'}
        </button>
        <button
          className="menu-trigger"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={(event) => {
            // Give native dialog restoration a reliable invoker, including WebKit.
            event.currentTarget.focus();
            mobile.current?.showModal();
            setMenuOpen(true);
          }}
        >
          Menu <span aria-hidden="true">+</span>
        </button>
      </nav>
      <dialog
        className="mobile-menu"
        id="mobile-menu"
        ref={mobile}
        aria-labelledby="mobile-menu-title"
        onClose={() => {
          setMenuOpen(false);
        }}
        onClick={(event) => {
          if (event.target === mobile.current) mobile.current.close();
        }}
      >
        <div className="mobile-menu-inner">
          <div className="dialog-heading">
            <span id="mobile-menu-title">NAVIGATION /</span>
            <button onClick={() => mobile.current?.close()} aria-label="Close navigation">
              Close ×
            </button>
          </div>
          <nav aria-label="Mobile navigation">{links}</nav>
        </div>
      </dialog>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
