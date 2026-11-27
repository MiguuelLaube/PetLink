import { expect, test, type Page } from '@playwright/test';
import { login, logout, skipSplash, watchConsole } from './helpers';

test.beforeEach(async ({ page }) => skipSplash(page));

async function fillPetForm(page: Page, name: string, photo = true) {
  const dlg = page.getByRole('dialog');
  await dlg.getByRole('textbox', { name: 'Nome', exact: true }).fill(name);
  await dlg.getByLabel('Idade aproximada').fill('1 ano');
  await dlg.getByLabel('Descrição').fill('Muito brincalhão, adora bolinhas e se dá bem com todo mundo.');
  await dlg.getByRole('button', { name: 'Continuar' }).click();
  await dlg.getByRole('button', { name: 'Adicionar' }).first().click();
  await dlg.getByRole('textbox', { name: 'Vacina', exact: true }).fill('V10');
  await dlg.getByLabel('Aplicada em').fill('2026-10-01');
  await dlg.getByLabel('Próximo reforço').fill('2027-10-01');
  await dlg.getByRole('button', { name: 'Continuar' }).click();
  await dlg.getByRole('button', { name: 'Continuar' }).click();
  if (photo) await dlg.locator('input[type=file]').setInputFiles('e2e/foto-teste.png');
  await dlg.getByRole('button', { name: 'Continuar' }).click();
  await expect(dlg.getByText(/Em análise/).first()).toBeVisible();
  await dlg.getByRole('button', { name: 'Salvar e enviar para análise' }).click();
}

test('pet da ONG só aparece no catálogo depois da aprovação do admin', async ({ page }) => {
  const check = watchConsole(page);
  const name = `Biscoito ${Date.now() % 10000}`;
  await login(page, 'ong@petlink.local');
  await page.goto('/ong/painel?aba=pets');
  await page.getByRole('button', { name: 'Cadastrar pet' }).click();
  await fillPetForm(page, name);
  await expect(page.getByText(/Pet cadastrado!/)).toBeVisible();
  const row = page.getByRole('listitem').filter({ hasText: name });
  await expect(row.getByText('Em análise')).toBeVisible();
  await logout(page);

  await page.goto('/adocao');
  await expect(page.getByText(/animais encontrados/)).toBeVisible();
  await expect(page.getByRole('link', { name, exact: true })).toHaveCount(0);

  await login(page, 'admin@petlink.local');
  await page.goto('/admin?aba=pets');
  await page.getByRole('listitem').filter({ hasText: name }).getByRole('button', { name: 'Publicar' }).click();
  await expect(page.getByText('Pet publicado no catálogo.')).toBeVisible();
  await logout(page);

  await page.goto('/adocao');
  await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
  check();
});

test('lar temporário: relato → ONG aceita → promove a pet em análise', async ({ page }) => {
  const check = watchConsole(page);
  const name = `Tigrinho ${Date.now() % 10000}`;
  await login(page, 'adotante@petlink.local');
  await page.goto('/lar-temporario');
  await page.getByLabel('Nome provisório').fill(name);
  await page.getByLabel('Espécie').selectOption('Gato');
  await page.getByLabel('Porte').selectOption('Pequeno');
  await page.getByLabel('Cidade onde está').fill('São Paulo');
  await page.getByLabel('UF').selectOption('SP');
  await page.getByLabel('O que aconteceu?').fill('Filhote miando sozinho embaixo de um carro há dois dias, parece saudável.');
  await page.getByLabel('Telefone para contato').fill('(11) 98888-1234');
  await page.locator('input[type=file]').setInputFiles('e2e/foto-teste.png');
  await page.getByLabel(/Autorizo que as ONGs/).check();
  await page.getByRole('button', { name: 'Enviar relato' }).click();
  await expect(page).toHaveURL(/aba=lar-temporario/);
  await expect(page.getByRole('listitem').filter({ hasText: name }).getByText('Aguardando ONG')).toBeVisible();
  await logout(page);

  await login(page, 'ong@petlink.local');
  await page.goto('/ong/painel?aba=lar-temporario');
  const card = page.getByRole('listitem').filter({ hasText: name });
  await card.getByRole('button', { name: 'Aceitar acolhimento' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Aceitar' }).click();
  await expect(card.getByText('Aceito')).toBeVisible();
  await card.getByRole('button', { name: 'Promover a pet' }).click();
  const dlg = page.getByRole('dialog');
  await expect(dlg.getByRole('textbox', { name: 'Nome', exact: true })).toHaveValue(name);
  await dlg.getByLabel('Idade aproximada').fill('2 meses');
  await dlg.getByLabel('Faixa etária').selectOption('Filhote');
  for (const step of ['Saúde', 'Comportamento', 'Fotos', 'Revisão']) {
    await dlg.getByRole('button', { name: 'Continuar' }).click();
    await expect(dlg.locator('[aria-current="step"]')).toContainText(step);
  }
  await dlg.getByRole('button', { name: 'Salvar e enviar para análise' }).click();
  await expect(page.getByText(/Pet cadastrado!/)).toBeVisible();
  await expect(card.getByText('Virou ficha')).toBeVisible();
  await page.goto('/ong/painel?aba=pets');
  await expect(page.getByRole('listitem').filter({ hasText: name }).getByText('Em análise')).toBeVisible();
  await logout(page);

  await login(page, 'adotante@petlink.local');
  await page.goto('/minha-conta?aba=lar-temporario');
  const mine = page.getByRole('listitem').filter({ hasText: name });
  await expect(mine.getByText('Aceito', { exact: true })).toBeVisible();
  await expect(mine.getByText('Já está no catálogo')).toBeVisible();
  check();
});
