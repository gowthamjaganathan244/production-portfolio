'use client';
import { useEffect, useState } from 'react';
import { convertText, type HashOperation } from '@/lib/lab';
export function HashDecoder() {
  const [input, setInput] = useState(''),
    [operation, setOperation] = useState<HashOperation>('sha256');
  const [output, setOutput] = useState('');
  useEffect(() => {
    let current = true;
    const timer = setTimeout(() => {
      convertText(input, operation)
        .then((result) => {
          if (current) setOutput(result);
        })
        .catch(() => {
          if (current) setOutput('Could not convert that input. Check the encoding.');
        });
    }, 120);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [input, operation]);
  return (
    <>
      <p className="lab-copy">
        Convert text the way an analyst would while reading logs or tokens. Everything stays in your
        browser.
      </p>
      <label className="field-label" htmlFor="hash-operation">
        Operation
      </label>
      <select
        className="field hash-operation"
        id="hash-operation"
        value={operation}
        onChange={(event) => setOperation(event.target.value as HashOperation)}
      >
        <option value="sha256">SHA-256 hash</option>
        <option value="b64e">Base64 encode</option>
        <option value="b64d">Base64 decode</option>
        <option value="rot13">ROT13</option>
        <option value="hex">Text to hex</option>
      </select>
      <label className="field-label" htmlFor="hash-input">
        Input text
      </label>
      <textarea
        className="field"
        id="hash-input"
        rows={3}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        maxLength={16000}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <pre className="hash-output" role="status" aria-label="Conversion result">
        {output}
      </pre>
    </>
  );
}
