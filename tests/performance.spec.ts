import { expect, test } from '@playwright/test';

for (const cores of [2, 8]) {
  test(`canvas resolution budget and no-op resize on ${cores}-core devices`, async ({ page }) => {
    await page.addInitScript((hardwareConcurrency) => {
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: hardwareConcurrency });
      Object.defineProperty(navigator, 'deviceMemory', { value: 8 });
      Object.defineProperty(navigator, 'connection', { value: { saveData: false } });
      Object.defineProperty(window, 'devicePixelRatio', { value: 2 });
    }, cores);
    await page.goto('/');
    const canvas = page.locator('canvas.hyperdrive');
    await expect(canvas).toBeAttached();
    const dimensions = await canvas.evaluate((el: HTMLCanvasElement, hardwareConcurrency) => {
      const cap = hardwareConcurrency === 2 ? 1 : matchMedia('(pointer: coarse)').matches ? 1.5 : 2;
      return { actual: el.width, expected: Math.trunc(innerWidth * cap) };
    }, cores);
    expect(dimensions.actual).toBe(dimensions.expected);
    const resets = await canvas.evaluate(async (el: HTMLCanvasElement) => {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, 'width')!;
      let writes = 0;
      Object.defineProperty(el, 'width', {
        configurable: true,
        get() {
          return descriptor.get!.call(this);
        },
        set(value) {
          writes++;
          descriptor.set!.call(this, value);
        },
      });
      try {
        for (let i = 0; i < 20; i++) dispatchEvent(new Event('resize'));
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        return writes;
      } finally {
        Reflect.deleteProperty(el, 'width');
      }
    });
    expect(resets).toBe(0);
  });
}

test('off-screen effects pause and return; motion toggle clears active tilt', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('.hero');
  const card = page.locator('.project-code');
  if (await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)) {
    await card.hover({ position: { x: 20, y: 20 } });
    await expect.poll(() => card.evaluate((el) => el.style.transform)).not.toBe('');
    await page.getByRole('button', { name: 'Pause decorative motion' }).click();
    await expect.poll(() => card.evaluate((el) => el.style.transform)).toBe('');
    await page.getByRole('button', { name: 'Resume decorative motion' }).click();
  }
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(hero).toHaveClass(/motion-offscreen/);
  await expect
    .poll(() =>
      hero.locator('.reflection').evaluate((el) => getComputedStyle(el).animationPlayState),
    )
    .toBe('paused');
  await hero.scrollIntoViewIfNeeded();
  await expect(hero).not.toHaveClass(/motion-offscreen/);
  await expect
    .poll(() =>
      hero.locator('.reflection').evaluate((el) => getComputedStyle(el).animationPlayState),
    )
    .toBe('running');
});
