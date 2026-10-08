'use client';
import { useRef, useState } from 'react';
import { Terminal } from './Terminal';
import { CaptureFlag } from './CaptureFlag';
import { PasswordLab } from './PasswordLab';
import { HashDecoder } from './HashDecoder';
const tabs = ['Terminal', 'Capture the flag', 'Password lab', 'Hash and decode'];
export function SecurityLab() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <>
      <div className="lab-tabs" role="tablist" aria-label="Security lab experiences">
        {tabs.map((tab, i) => (
          <button
            ref={(el) => {
              buttons.current[i] = el;
            }}
            key={tab}
            id={`lab-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls={`lab-pane-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(event) => {
              let next = i;
              if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
              else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = tabs.length - 1;
              else return;
              event.preventDefault();
              setActive(next);
              buttons.current[next]?.focus();
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {[
        <Terminal key="terminal" />,
        <CaptureFlag key="flag" />,
        <PasswordLab key="password" />,
        <HashDecoder key="hash" />,
      ].map((pane, i) => (
        <div
          className="pane"
          id={`lab-pane-${i}`}
          key={i}
          role="tabpanel"
          aria-labelledby={`lab-tab-${i}`}
          tabIndex={0}
          hidden={active !== i}
        >
          {pane}
        </div>
      ))}
    </>
  );
}
