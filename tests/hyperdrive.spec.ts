import { expect, test } from '@playwright/test';

declare global {
  interface Window {
    __warpFrames: number;
  }
}

test('hyperdrive viewport, DPR, pause, hidden-tab suspension and reduced motion', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const target = window;
    target.__warpFrames = 0;
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (
      this: CanvasRenderingContext2D,
      ...args: Parameters<CanvasRenderingContext2D['clearRect']>
    ) {
      if (this.canvas.classList.contains('hyperdrive')) target.__warpFrames++;
      return clear.call(this, ...args);
    };
  });
  await page.goto('/');
  const canvas = page.locator('canvas.hyperdrive');
  await expect(canvas).toHaveAttribute('aria-hidden', 'true');
  await expect.poll(() => page.evaluate(() => window.__warpFrames)).toBeGreaterThan(2);
  const verifyDimensions = async () => {
    const geometry = await canvas.evaluate((el: HTMLCanvasElement) => {
      const device = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { saveData?: boolean };
      };
      const constrained =
        (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4) ||
        (device.deviceMemory !== undefined && device.deviceMemory <= 4) ||
        device.connection?.saveData === true;
      const dpr = Math.min(
        devicePixelRatio || 1,
        constrained ? 1 : matchMedia('(pointer: coarse)').matches ? 1.5 : 2,
      );
      return {
        actual: [
          el.width,
          el.height,
          el.getBoundingClientRect().width,
          el.getBoundingClientRect().height,
        ],
        expected: [
          Math.trunc(innerWidth * dpr),
          Math.trunc(innerHeight * dpr),
          innerWidth,
          innerHeight,
        ],
        position: getComputedStyle(el).position,
        pointerEvents: getComputedStyle(el).pointerEvents,
      };
    });
    expect(geometry.actual).toEqual(geometry.expected);
    expect(geometry.position).toBe('fixed');
    expect(geometry.pointerEvents).toBe('none');
  };
  const framesOverFiveTicks = () =>
    page.evaluate(async () => {
      const target = window;
      const before = target.__warpFrames;
      for (let i = 0; i < 5; i++) await new Promise(requestAnimationFrame);
      return target.__warpFrames - before;
    });
  await verifyDimensions();
  await page.getByRole('button', { name: 'Pause decorative motion' }).click();
  expect(await framesOverFiveTicks()).toBe(0);
  await page.getByRole('button', { name: 'Resume decorative motion' }).click();
  expect(await framesOverFiveTicks()).toBeGreaterThan(0);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(await framesOverFiveTicks()).toBe(0);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, 'hidden');
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(await framesOverFiveTicks()).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Allow the media-query change event to draw its one static frame.
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  expect(await framesOverFiveTicks()).toBe(0);
  await page.setViewportSize({ width: 320, height: 568 });
  await expect.poll(async () => canvas.evaluate((el) => el.style.width)).toBe('320px');
  await verifyDimensions();
  expect(await framesOverFiveTicks()).toBe(0);
});
