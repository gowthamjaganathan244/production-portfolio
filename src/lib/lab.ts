export const FLAG = 'FLAG{least_privilege_wins}';
export const rot13 = (value: string) =>
  value.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
export const encodeBase64 = (value: string) =>
  btoa(Array.from(new TextEncoder().encode(value), (byte) => String.fromCharCode(byte)).join(''));
export const decodeBase64 = (value: string) =>
  new TextDecoder('utf-8', { fatal: true }).decode(
    Uint8Array.from(atob(value.trim()), (char) => char.charCodeAt(0)),
  );
export const cipher = () => encodeBase64(rot13(FLAG));
export type HashOperation = 'sha256' | 'b64e' | 'b64d' | 'rot13' | 'hex';
export async function convertText(value: string, operation: HashOperation): Promise<string> {
  if (!value) return '';
  const hex = (bytes: Uint8Array, separator = '') =>
    Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(separator);
  switch (operation) {
    case 'sha256':
      if (!globalThis.crypto?.subtle) return 'SHA-256 needs HTTPS or localhost.';
      return hex(
        new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))),
      );
    case 'b64e':
      return encodeBase64(value);
    case 'b64d':
      return decodeBase64(value);
    case 'rot13':
      return rot13(value);
    case 'hex':
      return hex(new TextEncoder().encode(value), ' ');
  }
}
const COMMON = [
  'password',
  '123456',
  '12345678',
  'qwerty',
  'letmein',
  'admin',
  'welcome',
  'iloveyou',
  'abc123',
  'password1',
  '111111',
  'dragon',
  'monkey',
];
function formatTime(seconds: number): string {
  if (seconds < 1) return 'instantly';
  const units: [string, number][] = [
    ['seconds', 60],
    ['minutes', 60],
    ['hours', 24],
    ['days', 365],
    ['years', 1000],
    ['thousand years', 1000],
    ['million years', 1e9],
  ];
  for (const [unit, divisor] of units) {
    if (seconds < divisor) return `${Math.max(1, Math.round(seconds))} ${unit}`;
    seconds /= divisor;
  }
  return 'beyond practical estimation';
}
export function estimatePassword(value: string) {
  let pool = 0;
  if (/[a-z]/.test(value)) pool += 26;
  if (/[A-Z]/.test(value)) pool += 26;
  if (/\d/.test(value)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(value)) pool += 33;
  const common = COMMON.includes(value.toLowerCase()) || /^(.)\1+$/.test(value);
  let bits = [...value].length * Math.log2(pool || 1);
  if (common) bits = Math.min(bits, 10);
  return {
    bits: Math.round(bits),
    common,
    length: [...value].length,
    rating: bits < 40 ? 'Weak' : bits < 60 ? 'Fair' : bits < 80 ? 'Strong' : 'Excellent',
    time: formatTime(2 ** (bits - 1) / 1e10),
  };
}
