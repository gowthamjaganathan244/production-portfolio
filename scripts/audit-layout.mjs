import { chromium, firefox, webkit } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const sizes = [
  [240, 320],
  [280, 653],
  [320, 568],
  [360, 640],
  [375, 667],
  [390, 844],
  [414, 896],
  [430, 932],
  [480, 854],
  [540, 720],
  [600, 960],
  [720, 1280],
  [768, 1024],
  [800, 1280],
  [820, 1180],
  [834, 1194],
  [912, 1368],
  [1024, 1366],
  [1024, 600],
  [1024, 768],
  [1280, 720],
  [1280, 800],
  [1366, 768],
  [1440, 900],
  [1536, 864],
  [1600, 900],
  [1680, 1050],
  [1920, 1080],
  [1920, 1200],
  [2560, 1440],
  [2560, 1080],
  [3440, 1440],
  [3840, 1600],
  [3840, 2160],
  [568, 320],
  [667, 375],
  [736, 414],
  [812, 375],
  [844, 390],
  [896, 414],
  [320, 480],
  [320, 640],
  [360, 720],
  [360, 740],
  [375, 812],
  [393, 852],
  [414, 736],
  [810, 1080],
  [834, 1112],
  [960, 600],
  [1280, 800],
  [1080, 810],
  [1180, 820],
  [1112, 834],
  [1194, 834],
  [1366, 1024],
  ...[320, 360, 384, 393, 400, 412, 414, 432, 480].flatMap((width) =>
    [16 / 9, 18 / 9, 19.5 / 9, 20 / 9].map((ratio) => [width, Math.round(width * ratio)]),
  ),
  ...[340, 350, 370, 400, 450, 500, 550, 650, 700, 750, 900, 950, 1100, 1200].map((w) => [w, 800]),
];
const uniqueSizes = [...new Map(sizes.map((size) => [size.join('x'), size])).values()];
const report = [];
const engineErrors = {};
for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
  const browser = await engine.launch();
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(process.env.PORTFOLIO_URL || 'http://127.0.0.1:3102');
  await page.locator('#lab').scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: 'Terminal', exact: true }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  const inspect = async (scenario) => {
    const issues = await page.evaluate(() => {
      const w = innerWidth;
      const bad = [...document.querySelectorAll('main *, header *, .navbar *, footer *')]
        .filter((e) => {
          if (e.closest('.ticker,.reflection,.sr-only,[hidden]') || !e.getClientRects().length)
            return false;
          const r = e.getBoundingClientRect();
          return (
            r.width > 0 &&
            (r.right > w + 1 ||
              r.left < -1 ||
              (e.matches('button,h1,h2,h3,.chips li,.phone,.counters .card') &&
                e.scrollWidth > e.clientWidth + 2))
          );
        })
        .map((e) => ({
          tag: e.tagName,
          cls: e.className,
          text: e.textContent.slice(0, 65),
          width: e.clientWidth,
          scroll: e.scrollWidth,
        }));
      return { overflow: document.documentElement.scrollWidth > w, bad: bad.slice(0, 15) };
    });
    report.push({ engine: name, scenario, ...issues });
  };
  for (const [width, height] of uniqueSizes) {
    await page.setViewportSize({ width, height });
    await inspect(`${width}x${height}`);
  }
  for (const width of [240, 320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const scale of [1.25, 1.5, 2]) {
      await page.evaluate((s) => (document.documentElement.style.fontSize = `${s * 100}%`), scale);
      await inspect(`text ${scale * 100}% at ${width}`);
    }
    await page.evaluate(() => (document.documentElement.style.fontSize = ''));
  }
  console.log(
    name,
    'issues:',
    report.filter((x) => x.engine === name && (x.overflow || x.bad.length)).length,
    'errors:',
    errors,
  );
  engineErrors[name] = errors;
  await browser.close();
}
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/layout-audit.json', JSON.stringify(report, null, 2));
console.log(
  'Scenarios:',
  report.length,
  'Failing:',
  report.filter((x) => x.overflow || x.bad.length).length,
);
await writeFile('artifacts/layout-errors.json', JSON.stringify(engineErrors, null, 2));
if (
  report.some((x) => x.overflow || x.bad.length) ||
  Object.values(engineErrors).some((errors) => errors.length)
)
  throw new Error('Layout regression: inspect artifacts/layout-audit.json');
console.log(
  JSON.stringify(
    report.filter((x) => x.engine === 'chromium' && (x.overflow || x.bad.length)),
    null,
    2,
  ),
);
