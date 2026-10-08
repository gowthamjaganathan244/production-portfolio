// No invented production origin: local previews omit canonical/sitemap URLs.
export function siteOrigin(): string | undefined {
  const configured = process.env.SITE_URL;
  if (!configured) return undefined;
  const url = new URL(configured);
  if (!['https:', 'http:'].includes(url.protocol))
    throw new Error('SITE_URL must be an HTTP(S) origin.');
  return url.origin;
}
