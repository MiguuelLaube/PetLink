import { expect, test } from '@playwright/test';
import { login, logout, skipSplash, watchConsole } from './helpers';

test.beforeEach(async ({ page }) => skipSplash(page));

test('fluxo completo: questionário → aprovação → contato → conclusão → adotado', async ({ page }) => {
  const check = watchConsole(page);
  // 1. Adotante envia o questionário
  await login(page, 'adotante@petlink.local');
  await page.goto('/adocao/caramelo');
  await expect(page.getByRole('heading', { level: 1, name: 'Caramelo' })).toBeVisible();
  await page.getByRole('button', { name: 'Quero adotar' }).click();
  const dlg = page.getByRole('dialog');
  await expect(dlg.getByLabel('Nome completo')).toHaveValue('Ana Souza');
  await dlg.getByRole('button', { name: 'Continuar' }).click();
  await dlg.getByLabel('Tipo de moradia').selectOption('Casa com quintal');
  await dlg.getByLabel('Janelas teladas e portões seguros?').selectOption('Sim');
  await dlg.getByLabel('Há outros animais em casa?').fill('Não');
  await dlg.getByLabel('Moram crianças ou idosos com você?').fill('Não');
  await dlg.getByRole('button', { name: 'Continuar' }).click();
  await dlg.getByLabel(/ficaria sozinho/).selectOption('Menos de 4 horas');
  await dlg.getByLabel('Melhor horário para a visita').selectOption('Fim de semana');
  await dlg.getByRole('button', { name: 'Continuar' }).click();
  await dlg.getByRole('button', { name: 'Enviar pedido' }).click();
  await expect(dlg.getByText('Aceite os termos de adoção responsável')).toBeVisible();
  await dlg.getByLabel(/Li e aceito os termos/).check();
  await dlg.getByLabel(/Autorizo o PetLink/).check();
  await dlg.getByRole('button', { name: 'Enviar pedido' }).click();
  await expect(page.getByText(/Pedido enviado!/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Você já enviou um pedido/ })).toBeVisible();
  await page.goto('/minha-conta?aba=adocoes');
  await expect(page.getByRole('tabpanel').getByRole('listitem').filter({ hasText: 'Caramelo' }).first().getByText('Enviado', { exact: true }).first()).toBeVisible();
  await logout(page);

  // 2. ONG aprova
  await login(page, 'ong@petlink.local');
  await page.goto('/ong/painel?aba=candidatos');
  const row = page.getByRole('listitem').filter({ hasText: 'Quer adotar Caramelo' });
  await row.getByRole('button', { name: 'Ver ficha' }).click();
  await expect(page.getByRole('dialog').getByText('Casa com quintal')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Aprovar' }).click();
  await expect(page.getByText(/Pedido aprovado\./)).toBeVisible();
  await logout(page);

  // 3. Adotante vê o status e o contato
  await login(page, 'adotante@petlink.local');
  await page.goto('/minha-conta?aba=adocoes');
  const card = page.getByRole('tabpanel').getByRole('listitem').filter({ hasText: 'Caramelo' }).first();
  await expect(card.getByText('Aprovado', { exact: true }).first()).toBeVisible();
  await expect(card.getByText('Contato da Amigos de Patas')).toBeVisible();
  await expect(card.getByText('(11) 98765-4321')).toBeVisible();
  await expect(page.getByText(/Pedido aprovado: Caramelo/)).toBeVisible();
  await logout(page);

  // 4. ONG conclui a adoção
  await login(page, 'ong@petlink.local');
  await page.goto('/ong/painel?aba=candidatos');
  await page.getByRole('listitem').filter({ hasText: 'Quer adotar Caramelo' }).getByRole('button', { name: 'Ver ficha' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Concluir adoção' }).click();
  await page.getByRole('dialog', { name: 'Concluir adoção?' }).getByRole('button', { name: 'Concluir adoção' }).click();
  await expect(page.getByText(/Adoção concluída!/)).toBeVisible();

  // 5. Pet aparece como adotado e o histórico registra tudo
  await page.goto('/adocao/caramelo');
  await expect(page.getByText('Adotado', { exact: true }).first()).toBeVisible();
  const timeline = page.locator('section[aria-labelledby="historico"]');
  for (const t of ['Novo pedido de adoção', 'Pedido aprovado', 'Adoção concluída']) await expect(timeline.getByText(t).first()).toBeVisible();
  await page.goto('/adocao');
  await expect(page.getByRole('link', { name: 'Caramelo' })).toHaveCount(0);
  check();
});

test('ficha mostra status de vacinas calculado pela data', async ({ page }) => {
  await page.goto('/adocao/bob');
  const saude = page.locator('section[aria-labelledby="saude"]');
  await expect(saude.getByRole('row', { name: /Antirrábica/ }).getByText('Atrasada')).toBeVisible();
  await expect(saude.getByRole('row', { name: /V10/ }).getByText('Em dia')).toBeVisible();
  await page.goto('/adocao/frida');
  await expect(page.locator('section[aria-labelledby="saude"]').getByRole('row', { name: /V4/ }).getByText('Vence em até 30 dias')).toBeVisible();
});
