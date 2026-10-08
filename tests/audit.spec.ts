import { test, expect } from '@playwright/test';

test('large-text lab panels, future labels, and ordinary text selection', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#lab');
  await page.getByRole('tab', { name: 'Terminal', exact: true }).waitFor();
  for (const width of [240, 320, 390, 768]) {
    await page.setViewportSize({ width, height: 800 });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    for (const name of ['Terminal', 'Capture the flag', 'Password lab', 'Hash and decode']) {
      await page.getByRole('tab', { name, exact: true }).click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${name} at ${width}`,
      ).toBe(true);
    }
  }
  await page.evaluate(() => {
    document.querySelector('.project-card h3')!.textContent =
      'Longer future project name with ordinary extended wording';
    document.querySelector('.workflow-node')!.textContent =
      'Permission-aware retrieval and authorization';
    document.querySelector('.cert-card h3')!.textContent =
      'Extended certification title for a future credential';
    document.querySelector('[data-role]')!.textContent = 'Senior Cloud Platform Software Developer';
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const selector of ['.about-copy p', '.project-code code', '.terminal-output']) {
    const selected = await page
      .locator(selector)
      .first()
      .evaluate((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const selection = getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);
        return selection.toString();
      });
    // Hidden terminal content cannot be selected; activate its tab first below.
    if (selector !== '.terminal-output') expect(selected.length).toBeGreaterThan(20);
  }
  await page.getByRole('tab', { name: 'Terminal', exact: true }).click();
  expect(
    await page.getByRole('log').evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      getSelection()!.removeAllRanges();
      getSelection()!.addRange(range);
      return getSelection()!.toString().length;
    }),
  ).toBeGreaterThan(20);
});

test('tiny screens, large text, short dialogs, orientation and all anchors', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const [width, height] of [
    [240, 320],
    [280, 653],
    [568, 320],
    [390, 844],
    [844, 390],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'NAVIGATION /' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await page.getByRole('button', { name: 'Open command console' }).click();
    await page.getByRole('combobox').fill('cert');
    await page.keyboard.press('Enter');
    await expect(page.locator('#certs')).toBeFocused();
    await page.getByRole('button', { name: 'Open command console' }).click();
    await expect(page.getByRole('combobox')).toHaveValue('');
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  for (const id of ['about', 'skills', 'projects', 'lab', 'experience', 'certs', 'contact']) {
    await page.goto(`/#${id}`);
    await expect
      .poll(() =>
        page.locator(`#${id}`).evaluate((el) => {
          const heading = el.querySelector('h2')!;
          return (
            heading.getBoundingClientRect().top >=
            document.querySelector('.navbar')!.getBoundingClientRect().bottom
          );
        }),
      )
      .toBe(true);
    await page.reload();
    await expect(page.locator(`#${id} h2`)).toBeVisible();
  }
});

test('every workflow node, terminal command, CTF edge and conversion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#projects');
  for (const node of await page.locator('.workflow-node').all()) {
    await node.focus();
    await page.keyboard.press('Enter');
    await expect(node).toHaveAttribute('aria-pressed', 'true');
    const detail = page.locator(`#${await node.getAttribute('aria-controls')}`);
    await expect(detail.locator('b')).not.toBeEmpty();
  }
  await page.locator('#lab').scrollIntoViewIfNeeded();
  const input = page.getByRole('textbox', { name: 'Terminal command' });
  const output = page.getByRole('log');
  const commands: [string, string][] = [
    ['help', 'Hint:'],
    ['ls', 'README.md'],
    ['cat', 'usage:'],
    ['cat README.md', 'written permission'],
    ['cat about.txt', 'Cloud-focused'],
    ['cat /etc/passwd', 'Permission denied'],
    ['cat missing', 'No such file'],
    ['cat __proto__', 'No such file'],
    ['whoami', 'gowtham:'],
    ['skills', 'Terraform'],
    ['projects', 'Secure Vault'],
    ['certs', 'Solutions Architect'],
    ['contact', 'https://github.com/gowthamjaganathan244'],
    ['nmap portfolio', 'Scan complete'],
    ['sudo nope', 'Access denied'],
    ['rm -rf /', 'destructive commands are disabled'],
    ['unknown', 'command not found'],
  ];
  for (const [command, result] of commands) {
    await input.fill(command);
    await input.press('Enter');
    await expect(output).toContainText(result);
  }
  await input.fill('clear');
  await input.press('Enter');
  await expect(output).toBeEmpty();
  await input.fill('sudo hire gowtham');
  await input.press('Enter');
  await expect(page.locator('#contact')).toBeFocused();
  await page.getByRole('tab', { name: 'Capture the flag' }).click();
  const flag = page.getByRole('textbox', { name: 'Flag', exact: true });
  await page.getByRole('button', { name: 'Submit flag' }).click();
  await expect(page.locator('#lab-pane-1')).toContainText('Enter a flag first');
  await flag.fill('bad');
  await flag.press('Enter');
  await expect(page.locator('#lab-pane-1')).toContainText('Not quite');
  await flag.fill('  flag{least_privilege_wins}  ');
  await flag.press('Enter');
  await expect(page.locator('#lab-pane-1')).toContainText('Flag captured');
  await page.getByRole('tab', { name: 'Password lab' }).click();
  const password = page.getByRole('textbox', { name: 'Test password' });
  for (const value of ['', 'aaaaaa', 'Correct horse battery staple!42', '🌏'.repeat(100)]) {
    await password.fill(value);
    if (value) await expect(page.locator('.password-stats')).not.toContainText('NaN');
  }
  await page.getByRole('tab', { name: 'Hash and decode' }).click();
  const operation = page.getByLabel('Operation', { exact: true });
  const text = page.getByRole('textbox', { name: 'Input text' });
  const result = page.getByRole('status', { name: 'Conversion result' });
  for (const [op, value, expected] of [
    ['rot13', 'Hello 123!', 'Uryyb 123!'],
    ['hex', 'A🌏', '41 f0 9f 8c 8f'],
    ['b64d', '/w==', 'Could not convert'],
    ['sha256', '', ''],
  ]) {
    await operation.selectOption(op);
    await text.fill(value);
    if (expected) await expect(result).toContainText(expected);
    else await expect(result).toBeEmpty();
  }
  await operation.selectOption('rot13');
  await text.fill('A'.repeat(16000));
  await expect(result).toHaveText('N'.repeat(16000));
  await operation.selectOption('hex');
  await text.fill('Z');
  await expect(result).toHaveText('5a');
});

test('forced colors, print, missing browser APIs and font/network integrity', async ({ page }) => {
  const failures: string[] = [];
  page.on('response', (r) => {
    if (r.status() >= 400) failures.push(r.url());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').length),
  ).toBeGreaterThanOrEqual(4);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.locator('.navbar')).toHaveCSS('border-top-style', 'solid');
  await page.emulateMedia({ forcedColors: 'none', media: 'print' });
  await expect(page.locator('.navbar')).not.toBeVisible();
  await expect(page.locator('.about-copy')).toHaveCSS('color', 'rgb(51, 51, 51)');
  await page.emulateMedia({ media: 'screen' });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'IntersectionObserver', { value: undefined, configurable: true });
    // Delete, rather than set undefined, to exercise feature detection.
    Reflect.deleteProperty(window, 'IntersectionObserver');
    Reflect.deleteProperty(window, 'ResizeObserver');
    Object.defineProperty(window.crypto, 'subtle', { value: undefined, configurable: true });
    HTMLCanvasElement.prototype.getContext = (() =>
      null) as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.reload();
  await page.locator('#lab').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Initialize sandbox' }).click();
  await page.getByRole('tab', { name: 'Hash and decode' }).click();
  await page.getByRole('textbox', { name: 'Input text' }).fill('abc');
  await expect(page.getByRole('status', { name: 'Conversion result' })).toContainText('HTTPS');
  await page.getByRole('button', { name: 'Open command console' }).click();
  await expect(page.getByRole('combobox', { name: 'Search commands' })).toBeFocused();
  expect(failures).toEqual([]);
});
