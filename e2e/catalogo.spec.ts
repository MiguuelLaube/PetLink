import { expect, test } from '@playwright/test';
import { skipSplash, watchConsole } from './helpers';

test.beforeEach(async ({ page }) => skipSplash(page));

test('filtros combinados ficam na URL e sobrevivem ao recarregar', async ({ page }) => {
  const check = watchConsole(page);
  await page.goto('/adocao');
  await expect(page.getByText(/animais encontrados/)).toBeVisible();
  const aside = page.getByRole('complementary', { name: 'Filtros' });
  await aside.getByRole('button', { name: 'Gato', exact: true }).click();
  await aside.getByRole('button', { name: 'Filhote', exact: true }).click();
  await expect(page).toHaveURL(/especie=Gato/);
  await expect(page).toHaveURL(/idade=Filhote/);
  await expect(page.getByRole('link', { name: 'Luna', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Tomás', exact: true })).toHaveCount(0);
  await page.reload();
  await expect(aside.getByRole('button', { name: 'Gato', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('1 animal encontrado')).toBeVisible();

  await page.goto('/adocao?especiais=1&uf=RJ');
  await expect(page.getByRole('link', { name: 'Nina', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Frida', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Bob', exact: true })).toHaveCount(0);

  await page.getByLabel('Buscar por nome ou raça').fill('fri');
  await expect(page).toHaveURL(/q=fri/);
  await expect(page.getByText('1 animal encontrado')).toBeVisible();
  check();
});

test('pets em análise não aparecem no catálogo nem pela URL', async ({ page }) => {
  await page.goto('/adocao');
  await expect(page.getByText(/animais encontrados/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Zeca', exact: true })).toHaveCount(0);
  await page.goto('/adocao/zeca');
  await expect(page.getByText('Animal não encontrado')).toBeVisible();
});
