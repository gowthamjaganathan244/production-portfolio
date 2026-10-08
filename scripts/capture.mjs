import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  await page.goto(process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:3000');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#lab').scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: 'Terminal', exact: true }).waitFor();
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'artifacts/desktop.png', fullPage: true });
  await page.screenshot({ path: 'artifacts/hero-desktop.png' });
  await page.locator('.projects-grid').screenshot({ path: 'artifacts/projects-desktop.png' });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'artifacts/mobile-320.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'artifacts/hero-mobile.png' });
  await page.locator('.project-card').first().screenshot({ path: 'artifacts/projects-mobile.png' });
  if (process.env.PORTFOLIO_REFERENCE) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(new URL(`file://${process.env.PORTFOLIO_REFERENCE}`).href);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: 'artifacts/source-desktop.png', fullPage: true });
    await page.screenshot({ path: 'artifacts/source-hero.png' });
  }
} finally {
  await browser.close();
}
