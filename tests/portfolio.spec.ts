import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('public HTML and contact actions do not expose private contact details', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBe(true);
  const html = await response!.text();
  expect(html).not.toMatch(/mailto:|tel:/i);
  expect(html).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  expect(html).not.toMatch(/\+61(?:[\s()-]*\d){9}/);
  await expect(page.locator('#contact a')).toHaveCount(2);
  await page.getByRole('button', { name: 'Open command console' }).click();
  await page.getByRole('combobox').fill('LinkedIn');
  await expect(page.getByRole('option', { name: /Connect on LinkedIn/ })).toBeVisible();
});

test('content, console errors and responsive overflow', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Gowtham Jaganathan' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const sizes = testInfo.project.name.startsWith('mobile')
    ? [
        [320, 568],
        [360, 800],
        [375, 667],
        [390, 844],
        [393, 852],
        [412, 915],
        [430, 932],
      ]
    : [
        [320, 568],
        [360, 800],
        [375, 667],
        [390, 844],
        [430, 932],
        [768, 1024],
        [820, 1180],
        [834, 1194],
        [1024, 1366],
        [1280, 720],
        [1366, 768],
        [1440, 900],
        [1512, 982],
        [1920, 1080],
        [2560, 1440],
      ];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      .toBe(true);
    const clipped = await page
      .locator('h1, .project-code, .navbar, .workflow-node')
      .evaluateAll((elements) =>
        elements
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return (
              rect.width > 0 &&
              (rect.right > innerWidth + 1 || rect.left < -1 || el.scrollWidth > el.clientWidth + 2)
            );
          })
          .map((el) => el.className || el.tagName),
      );
    expect(clipped, `${width}px clipped elements`).toEqual([]);
  }
  expect(await page.locator('.project-card').count()).toBe(4);
  expect(await page.locator('.job').count()).toBe(6);
  expect(await page.locator('.cert-card').count()).toBe(3);
  expect(errors).toEqual([]);
});

test('command palette search, keyboard selection, focus restoration and trap', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Open command console' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'COMMAND CONSOLE /' });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('combobox')).toBeFocused();
  await page.getByRole('combobox').fill('zzzz');
  await expect(dialog.getByRole('status')).toContainText('No matching commands');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('projects');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#projects$/);
  await page.keyboard.press('Meta+k');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('.command-dialog'))).toBe(
    true,
  );
  await page.keyboard.press('Escape');
});

test('mobile navigation, workflow selection and motion preference', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Projects' })
    .click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  const lambda = page.getByRole('button', { name: 'Inspect Lambda', exact: true });
  await lambda.focus();
  await page.keyboard.press('Space');
  await expect(lambda).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#secure-vault-detail')).toContainText('short-lived access');
  await page.getByRole('button', { name: 'Pause decorative motion' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
});

test('security lab keyboard tabs, safe terminal, CTF, password and Unicode conversions', async ({
  page,
}) => {
  const labRequests: string[] = [];
  await page.goto('/#lab');
  await expect(page.getByRole('tab', { name: 'Terminal', exact: true })).toBeVisible();
  const terminal = page.getByRole('textbox', { name: 'Terminal command' });
  await terminal.fill('nmap example.com');
  await terminal.press('Enter');
  await expect(page.getByRole('log')).toContainText('Sandbox target only');
  await terminal.fill('cat flag.enc');
  await terminal.press('Enter');
  await terminal.press('ArrowUp');
  await expect(terminal).toHaveValue('cat flag.enc');
  await terminal.fill('<script>alert(1)</script>');
  await terminal.press('Enter');
  await expect(page.getByRole('log')).toContainText('command not found');
  await page.getByRole('tab', { name: 'Terminal', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Capture the flag' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.getByRole('textbox', { name: 'Flag', exact: true }).fill('FLAG{least_privilege_wins}');
  await page.getByRole('button', { name: 'Submit flag' }).click();
  await expect(page.locator('#lab-pane-1')).toContainText('Flag captured');
  await page.getByRole('tab', { name: 'Password lab' }).click();
  page.on('request', (request) => {
    if (request.method() !== 'GET') labRequests.push(request.url());
  });
  await page.getByRole('textbox', { name: 'Test password' }).fill('password');
  await expect(page.locator('.password-stats')).toContainText('Weak');
  await expect(page.locator('.password-stats')).toContainText('Common password');
  await page.getByRole('tab', { name: 'Hash and decode' }).click();
  await page.getByRole('textbox', { name: 'Input text' }).fill('abc');
  await expect(page.getByRole('status', { name: 'Conversion result' })).toHaveText(
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  );
  await page.getByLabel('Operation', { exact: true }).selectOption('b64e');
  await page.getByRole('textbox', { name: 'Input text' }).fill('Hello 🌏');
  await expect(page.getByRole('status', { name: 'Conversion result' })).toHaveText(
    'SGVsbG8g8J+Mjw==',
  );
  await page.getByRole('textbox', { name: 'Input text' }).fill('SGVsbG8g8J+Mjw==');
  await page.getByLabel('Operation', { exact: true }).selectOption('b64d');
  await expect(page.getByRole('status', { name: 'Conversion result' })).toHaveText('Hello 🌏');
  await page.getByRole('textbox', { name: 'Input text' }).fill('%%%');
  await expect(page.getByRole('status', { name: 'Conversion result' })).toContainText(
    'Could not convert',
  );
  expect(labRequests).toEqual([]);
});

test('accessibility audit including dialogs and each lab panel', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#lab');
  await expect(page.getByRole('tab', { name: 'Terminal', exact: true })).toBeVisible();
  const audit = async () => {
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    ).toEqual([]);
  };
  await audit();
  for (const name of ['Capture the flag', 'Password lab', 'Hash and decode']) {
    await page.getByRole('tab', { name }).click();
    await audit();
  }
  await page.getByRole('button', { name: 'Open command console' }).click();
  await audit();
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 320, height: 568 });
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await audit();
});

test('reduced motion and no-JavaScript progressive content', async ({ browser, page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.boot')).not.toBeVisible();
  await expect(page.locator('.cursor-ring')).not.toBeVisible();
  expect(
    await page.locator('.ticker-track').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 568 },
  });
  const nojs = await context.newPage();
  await nojs.goto('/');
  await expect(nojs.getByRole('heading', { name: 'Gowtham Jaganathan' })).toBeVisible();
  await expect(nojs.getByRole('navigation', { name: 'Section navigation' })).toBeVisible();
  await expect(nojs.getByRole('link', { name: 'LinkedIn (opens in a new tab)' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/gowtham-jaganathan-0b5354280/',
  );
  await expect(nojs.locator('.boot')).not.toBeVisible();
  await context.close();
});
