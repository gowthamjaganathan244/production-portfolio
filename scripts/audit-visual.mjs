import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const page = await browser.newPage({ reducedMotion: 'reduce' });
await mkdir('artifacts/comparison', { recursive: true });
const original = process.env.PORTFOLIO_REFERENCE;
if (!original) throw new Error('Set PORTFOLIO_REFERENCE to the supplied original HTML.');
const sources = {
  original: `file://${original}`,
  rebuild: process.env.PORTFOLIO_URL || 'http://127.0.0.1:3102',
};
const widths = [320, 375, 390, 430, 768, 1024, 1366, 1440, 1920];
const rows = [];
for (const width of widths) {
  const images = [];
  for (const [name, url] of Object.entries(sources)) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    for (const id of ['about', 'skills', 'projects', 'lab', 'experience', 'certs', 'contact'])
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    if (name === 'rebuild')
      await page.getByRole('tab', { name: 'Terminal', exact: true }).waitFor();
    await page.evaluate(() => scrollTo(0, 0));
    if (name === 'original') await page.waitForTimeout(1800); // Source counters ignore reduced motion.
    await page.screenshot({ path: `artifacts/comparison/hero-${name}-${width}.png` });
    const full = await page.screenshot({
      path: `artifacts/comparison/${name}-${width}.png`,
      fullPage: true,
    });
    images.push(full.toString('base64'));
  }
  rows.push({ width, images });
}
// Browser-rendered paired evidence sheets, without pixel-diff assertions against the broken source mobile layout.
for (const { width, images } of rows) {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.setContent(
    `<style>body{margin:0;background:#ddd}main{display:flex;gap:8px}img{width:596px;height:auto;align-self:start}h1{font:20px sans-serif}</style><h1>${width}px — original (left), rebuild (right)</h1><main>${images.map((x) => `<img src="data:image/png;base64,${x}">`).join('')}</main>`,
  );
  await page.screenshot({ path: `artifacts/comparison/pair-${width}.png`, fullPage: true });
}
await writeFile(
  'artifacts/comparison/index.json',
  JSON.stringify(
    {
      widths,
      notes:
        'Original and rebuilt production full-page captures. Source mobile overflow intentionally not copied.',
    },
    null,
    2,
  ),
);
await browser.close();
console.log('Captured 9 original/rebuild viewport pairs.');
