'use client';
import { useState } from 'react';
import { cipher, FLAG } from '@/lib/lab';
export function CaptureFlag() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  return (
    <>
      <p className="lab-copy">
        The string below is a flag in disguise, wrapped in two layers of encoding. Peel them off and
        submit the result in the form FLAG{'{...}'}.
      </p>
      <div className="cipher">{cipher()}</div>
      <p className="lab-copy">
        Hint: Base64 first, then ROT13. The Hash and decode tab can do both.
      </p>
      <form
        className="field-row"
        onSubmit={(event) => {
          event.preventDefault();
          setResult(
            input.trim().toLowerCase() === FLAG.toLowerCase()
              ? 'Flag captured. Least privilege wins.'
              : input.trim()
                ? 'Not quite. Decode Base64 first, then ROT13.'
                : 'Enter a flag first.',
          );
        }}
      >
        <label className="sr-only" htmlFor="flag-input">
          Flag
        </label>
        <input
          className="field"
          id="flag-input"
          placeholder="FLAG{...}"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={200}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button className="btn solid" type="submit">
          Submit flag
        </button>
      </form>
      <p className="lab-result" role="status">
        {result}
      </p>
    </>
  );
}
