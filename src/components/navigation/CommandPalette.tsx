'use client';
import { useEffect, useRef, useState } from 'react';
import { navigation, profile } from '@/data/portfolio';
const commands = [
  ...navigation.map((item) => ({
    label: item.id === 'lab' ? 'Security Lab' : item.label,
    href: `#${item.id}`,
  })),
  { label: 'Connect on LinkedIn', href: profile.linkedin },
  { label: 'View GitHub profile', href: profile.github },
];
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const filtered = commands.filter((command) =>
    command.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  useEffect(() => {
    const element = dialog.current;
    if (!open) {
      element?.close();
      return;
    }
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    input.current?.focus();
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, [open]);
  useEffect(() => {
    document.getElementById(`command-${index}`)?.scrollIntoView({ block: 'nearest' });
  }, [index]);
  const go = (href: string) => {
    onClose();
    if (href.startsWith('#')) {
      const target = document.querySelector<HTMLElement>(href);
      requestAnimationFrame(() => {
        target?.scrollIntoView();
        target?.setAttribute('tabindex', '-1');
        target?.focus({ preventScroll: true });
      });
      history.replaceState(null, '', href);
    } else location.href = href;
  };
  return (
    <dialog
      className="command-dialog"
      ref={dialog}
      aria-labelledby="console-title"
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>('button, input'),
        );
        const current = controls.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        controls[
          (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length
        ]?.focus();
      }}
      onClose={() => {
        // Native close is queued: it may arrive after a keyboard reopen.
        // Parent state is changed by explicit actions/cancel, never this stale event.
        if (!dialog.current?.open) {
          setQuery('');
          setIndex(0);
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      <div className="command-box">
        <div className="dialog-heading">
          <span id="console-title">COMMAND CONSOLE /</span>
          <button onClick={onClose} aria-label="Close command console">
            Esc ×
          </button>
        </div>
        <label className="sr-only" htmlFor="command-search">
          Search commands
        </label>
        <input
          ref={input}
          id="command-search"
          value={query}
          placeholder="Jump to…"
          autoComplete="off"
          role="combobox"
          aria-expanded="true"
          aria-controls="command-results"
          aria-autocomplete="list"
          aria-activedescendant={filtered.length ? `command-${index}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setIndex((value) =>
                filtered.length
                  ? (value + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) %
                    filtered.length
                  : 0,
              );
            }
            if (event.key === 'Enter' && filtered[index]) {
              event.preventDefault();
              go(filtered[index].href);
            }
          }}
        />
        <ul id="command-results" role="listbox" aria-label="Commands">
          {filtered.map((command, i) => (
            <li
              key={command.href}
              id={`command-${i}`}
              role="option"
              aria-selected={index === i}
              onPointerMove={() => setIndex(i)}
              onClick={() => go(command.href)}
            >
              {command.label}
              <span aria-hidden="true">{command.href.startsWith('#') ? '↵ go' : '↗ open'}</span>
            </li>
          ))}
        </ul>
        {!filtered.length && (
          <p className="empty-results" role="status">
            No matching commands.
          </p>
        )}
        <div className="console-hint">↑ ↓ navigate · enter select · esc close</div>
      </div>
    </dialog>
  );
}
