import { expect, type Page } from '@playwright/test';

export const PASSWORD = 'PetLink@2026';

/** Falha o teste se aparecer erro no console do navegador. */
export function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|ERR_|net::/.test(m.text())) errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return () => expect(errors, errors.join('\n')).toEqual([]);
}

export async function skipSplash(page: Page) {
  await page.addInitScript(() => localStorage.setItem('petlink:splash-visto', 'true'));
}

export async function login(page: Page, email: string) {
  await page.goto('/entrar');
  const main = page.getByRole('main');
  await main.getByLabel('E-mail').fill(email);
  await main.getByLabel('Senha').fill(PASSWORD);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).not.toHaveURL(/\/entrar/);
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page.getByRole('link', { name: 'Entrar', exact: true })).toBeVisible();
}
