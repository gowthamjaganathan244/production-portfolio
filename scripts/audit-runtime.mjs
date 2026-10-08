import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const cdp = await page.context().newCDPSession(page);
const report = { errors: [], network: [], dpr: [], zoomReflow: [], memory: [] };
const url = process.env.PORTFOLIO_URL || 'http://127.0.0.1:3102';
page.on('pageerror', (e) => report.errors.push(e.message));
await cdp.send('Performance.enable');
await cdp.send('Network.enable');
for (const [label, latency, throughput] of [
  ['Fast 3G', 150, 200000],
  ['Slow 4G', 150, 500000],
]) {
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency,
    downloadThroughput: throughput,
    uploadThroughput: throughput,
  });
  for (const warm of [false, true]) {
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: !warm });
    if (!warm) await cdp.send('Network.clearBrowserCache');
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    report.network.push({
      label,
      warm,
      ...(await page.evaluate(() => ({
        navigation: performance.getEntriesByType('navigation')[0].toJSON(),
        paint: performance.getEntriesByType('paint').map((x) => x.toJSON()),
        fonts: [...document.fonts].filter((f) => f.status === 'loaded').length,
      }))),
    });
  }
}
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 0,
  downloadThroughput: -1,
  uploadThroughput: -1,
});
for (const rate of [4, 6]) {
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  const start = Date.now();
  await page.getByRole('button', { name: 'Open command console' }).tap();
  await page.getByRole('combobox').fill('lab');
  await page.keyboard.press('Enter');
  await page.getByRole('tab', { name: 'Terminal', exact: true }).waitFor();
  await page.getByRole('textbox', { name: 'Terminal command' }).fill('help');
  await page.getByRole('textbox', { name: 'Terminal command' }).press('Enter');
  report[`cpu${rate}`] = {
    workflowMs: Date.now() - start,
    terminalWorked: (await page.getByRole('log').textContent()).includes('Hint:'),
  };
}
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
for (const dpr of [1, 1.25, 1.5, 2, 3]) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: dpr,
    mobile: true,
  });
  await page.waitForTimeout(100);
  report.dpr.push(
    await page.locator('canvas').evaluate((el) => {
      const constrained =
        (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) ||
        (navigator.deviceMemory !== undefined && navigator.deviceMemory <= 4) ||
        navigator.connection?.saveData === true;
      const cap = constrained ? 1 : matchMedia('(pointer: coarse)').matches ? 1.5 : 2;
      return {
        dpr: devicePixelRatio,
        width: el.width,
        expected: Math.floor(innerWidth * Math.min(cap, devicePixelRatio)),
      };
    }),
  );
}
// Effective-layout viewport emulation of desktop zoom; not a claim of native browser UI zoom.
for (const zoom of [0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2]) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: Math.round(1440 / zoom),
    height: Math.round(900 / zoom),
    deviceScaleFactor: zoom,
    mobile: false,
  });
  report.zoomReflow.push({
    zoom,
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  });
}
await cdp.send('Emulation.clearDeviceMetricsOverride');
await page.goto(url + '/#lab');
await page.getByRole('tab', { name: 'Terminal', exact: true }).waitFor();
const memorySteps = Number(process.env.MEMORY_STEPS ?? 18);
for (let step = 0; step <= memorySteps; step++) {
  await cdp.send('HeapProfiler.collectGarbage');
  const metrics = (await cdp.send('Performance.getMetrics')).metrics;
  report.memory.push({
    seconds: step * 10,
    ...Object.fromEntries(
      metrics
        .filter((x) =>
          ['JSHeapUsedSize', 'Nodes', 'JSEventListeners', 'Documents'].includes(x.name),
        )
        .map((x) => [x.name, x.value]),
    ),
  });
  if (step % 6 === 0) console.log('Memory sample:', step * 10, 'seconds');
  if (step === memorySteps) break;
  await page.getByRole('button', { name: 'Open command console' }).click();
  await page.getByRole('combobox', { name: 'Search commands' }).waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await page.getByRole('dialog', { name: 'COMMAND CONSOLE /' }).waitFor({ state: 'hidden' });
  const terminal = page.getByRole('textbox', { name: 'Terminal command' });
  await terminal.fill('help');
  await terminal.press('Enter');
  if (step % 3 === 0) {
    await terminal.fill('clear');
    await terminal.press('Enter');
  }
  await page.waitForTimeout(10000);
}
await mkdir('artifacts', { recursive: true });
await writeFile(
  `artifacts/runtime-audit${memorySteps ? '' : '-quick'}.json`,
  JSON.stringify(report, null, 2),
);
if (
  report.dpr.some((x) => x.width !== x.expected) ||
  report.zoomReflow.some((x) => x.overflow) ||
  report.errors.length
)
  throw new Error('Runtime regression: inspect the report');
console.log(JSON.stringify(report, null, 2));
await browser.close();
