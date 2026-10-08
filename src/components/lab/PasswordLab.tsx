'use client';
import { useState } from 'react';
import { estimatePassword } from '@/lib/lab';
export function PasswordLab() {
  const [value, setValue] = useState('');
  const estimate = estimatePassword(value);
  return (
    <>
      <p id="password-help" className="lab-copy">
        Type a test password, never a real one. The estimate is calculated locally and assumes 10
        billion guesses per second against a fast hash.
      </p>
      <label className="field-label" htmlFor="test-password">
        Test password
      </label>
      <input
        id="test-password"
        className="field"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-describedby="password-help password-caveat"
        maxLength={256}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder="try: password, then a long passphrase"
      />
      <div
        className="password-meter"
        role="meter"
        aria-label="Illustrative password strength"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value ? Math.min(100, estimate.bits) : 0}
      >
        <i style={{ transform: `scaleX(${value ? Math.min(100, estimate.bits) / 100 : 0})` }} />
      </div>
      <div className="password-stats" aria-live="polite">
        {value && (
          <>
            {[
              [estimate.bits, 'estimated bits of entropy'],
              [estimate.rating, 'illustrative rating'],
              [estimate.time, 'estimated crack time'],
              [estimate.length, 'characters'],
            ].map(([number, label]) => (
              <div key={label}>
                <b>{number}</b>
                <span>{label}</span>
              </div>
            ))}
            {estimate.common && <p>Common password: attackers try this immediately.</p>}
          </>
        )}
      </div>
      <p className="lab-note" id="password-caveat">
        Educational character-pool model, not a security guarantee. Patterns and reused phrases can
        be guessed much faster. Input stays in this browser and is never sent or saved.
      </p>
    </>
  );
}
