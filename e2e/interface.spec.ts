import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHmac, randomUUID } from 'node:crypto';

for (const theme of ['light', 'dark']) {
  for (const width of [320, 768, 1440]) {
    test(`${theme} ${width}: public pages pass accessibility checks`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
      for (const path of ['/ru', '/ru/blog', '/ru/projects/portfolio', '/ru/contact', '/en/contact']) {
        await page.goto(path);
        await page.addScriptTag({ path: resolve('node_modules/axe-core/axe.min.js') });
        const violations = await page.evaluate(async () => {
          const axe = (window as unknown as { axe: typeof import('axe-core') }).axe;
          const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } });
          return result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }));
        });
        expect(violations, path).toEqual([]);
      }
    });
  }
}

test('mobile menu closes with Escape and outside click', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/ru/contact');
  const trigger = page.locator('header button[aria-expanded]');
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator('h1').click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('long prose wraps without clipping', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/ru/projects/portfolio');
  const size = await page.locator('.prose p').first().evaluate((element) => {
    element.textContent = 'https://example.com/' + 'a'.repeat(150);
    return { width: element.clientWidth, scrollWidth: element.scrollWidth };
  });
  expect(size.scrollWidth).toBeLessThanOrEqual(size.width);
});

test('confirmation dialog traps focus and returns it without initial autofocus', async ({ page, context }) => {
  const id = randomUUID();
  const token = randomUUID();
  execFileSync('pnpm', ['exec', 'tsx', 'e2e/auth-fixture.ts', 'create', id, token]);
  try {
    const signature = createHmac('sha256', process.env.BETTER_AUTH_SECRET!).update(token).digest('base64');
    await context.addCookies([{ name: 'better-auth.session_token', value: encodeURIComponent(`${token}.${signature}`), url: 'http://localhost:3110' }]);
    await page.goto('/ru/admin/tags');
    const trigger = page.getByRole('button', { name: 'Удалить', exact: true }).first();
    await expect(trigger).toBeVisible();
    await expect(trigger).not.toBeFocused();
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await page.goto('/ru/admin/users');
    await expect(page.getByRole('combobox').first()).toHaveAccessibleName(/Роль пользователя/);
  } finally {
    execFileSync('pnpm', ['exec', 'tsx', 'e2e/auth-fixture.ts', 'delete', id]);
  }
});
