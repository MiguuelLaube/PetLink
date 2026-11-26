/**
 * Testa as Security Rules com os 3 perfis + visitante.
 * Rode com `npm run test:rules` (sobe o emulator do Firestore sozinho).
 */
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, collection, query, where, setDoc, updateDoc, writeBatch } from 'firebase/firestore';

let env: RulesTestEnvironment;

const basePet = {
  name: 'Luna', species: 'Gato', size: 'Pequeno', gender: 'Fêmea', mainImage: 'https://x/y.webp',
  status: 'Disponível', createdAt: '2026-01-01', updatedAt: '2026-01-01',
};

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-petlink-rules',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
  });
});

afterAll(async () => env?.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'users/ana'), { name: 'Ana', email: 'a@x', role: 'user', active: true });
    await setDoc(doc(db, 'users/bia'), { name: 'Bia', email: 'b@x', role: 'user', active: true });
    await setDoc(doc(db, 'users/ong1'), { name: 'ONG 1', role: 'ong', ongId: 'o1', active: true });
    await setDoc(doc(db, 'users/ong2'), { name: 'ONG 2', role: 'ong', ongId: 'o2', active: true });
    await setDoc(doc(db, 'users/adm'), { name: 'Admin', role: 'admin', active: true });
    await setDoc(doc(db, 'ongs/o1'), { name: 'ONG 1', ownerUid: 'ong1', status: 'aprovada', featured: false });
    await setDoc(doc(db, 'ongs/o2'), { name: 'ONG 2', ownerUid: 'ong2', status: 'aprovada', featured: false });
    await setDoc(doc(db, 'ongs/o3'), { name: 'ONG 3', ownerUid: 'x', status: 'pendente', featured: false });
    await setDoc(doc(db, 'pets/pub'), { ...basePet, ongId: 'o1', statusPublicacao: 'publicado' });
    await setDoc(doc(db, 'pets/rev'), { ...basePet, ongId: 'o1', statusPublicacao: 'em_analise' });
    await setDoc(doc(db, 'solicitations/s1'), { petId: 'pub', ongId: 'o1', adopterUid: 'ana', status: 'pending' });
    await setDoc(doc(db, 'fosterRequests/f1'), { requesterUid: 'bia', status: 'pending' });
  });
});

const as = (uid?: string) => (uid ? env.authenticatedContext(uid).firestore() : env.unauthenticatedContext().firestore());

describe('visitante', () => {
  it('lê pet publicado e não lê pet em análise', async () => {
    await assertSucceeds(getDoc(doc(as(), 'pets/pub')));
    await assertFails(getDoc(doc(as(), 'pets/rev')));
  });
  it('lista só com filtro de publicado', async () => {
    await assertSucceeds(getDocs(query(collection(as(), 'pets'), where('statusPublicacao', '==', 'publicado'))));
    await assertFails(getDocs(collection(as(), 'pets')));
  });
  it('lê ONG aprovada e não lê ONG pendente', async () => {
    await assertSucceeds(getDoc(doc(as(), 'ongs/o1')));
    await assertFails(getDoc(doc(as(), 'ongs/o3')));
  });
  it('não lê solicitações nem usuários', async () => {
    await assertFails(getDoc(doc(as(), 'solicitations/s1')));
    await assertFails(getDoc(doc(as(), 'users/ana')));
  });
});

describe('adotante', () => {
  it('não muda o próprio papel', async () => {
    await assertFails(updateDoc(doc(as('ana'), 'users/ana'), { role: 'admin' }));
    await assertSucceeds(updateDoc(doc(as('ana'), 'users/ana'), { name: 'Ana S.' }));
  });
  it('não cria perfil como admin ou ONG', async () => {
    await assertFails(setDoc(doc(as('novo'), 'users/novo'), { role: 'admin', active: true }));
    await assertFails(setDoc(doc(as('novo'), 'users/novo'), { role: 'ong', ongId: 'o1', active: true }));
    await assertSucceeds(setDoc(doc(as('novo'), 'users/novo'), { role: 'user', active: true, name: 'N' }));
  });
  it('lê o próprio pedido e não o de outra pessoa', async () => {
    await assertSucceeds(getDoc(doc(as('ana'), 'solicitations/s1')));
    await assertFails(getDoc(doc(as('bia'), 'solicitations/s1')));
  });
  it('cria pedido só para pet publicado, em nome próprio e com LGPD', async () => {
    const sol = { petId: 'pub', ongId: 'o1', adopterUid: 'bia', status: 'pending', lgpdConsent: true };
    await assertSucceeds(setDoc(doc(as('bia'), 'solicitations/s2'), sol));
    await assertFails(setDoc(doc(as('bia'), 'solicitations/s3'), { ...sol, adopterUid: 'ana' }));
    await assertFails(setDoc(doc(as('bia'), 'solicitations/s4'), { ...sol, petId: 'rev' }));
    await assertFails(setDoc(doc(as('bia'), 'solicitations/s5'), { ...sol, status: 'approved' }));
    await assertFails(setDoc(doc(as('bia'), 'solicitations/s6'), { ...sol, lgpdConsent: false }));
  });
  it('pode cancelar o próprio pedido, mas não aprovar', async () => {
    await assertFails(updateDoc(doc(as('ana'), 'solicitations/s1'), { status: 'approved' }));
    await assertSucceeds(updateDoc(doc(as('ana'), 'solicitations/s1'), { status: 'canceled', updatedAt: 'x' }));
  });
  it('não cria nem edita pets', async () => {
    await assertFails(setDoc(doc(as('ana'), 'pets/novo'), { ...basePet, ongId: 'o1', statusPublicacao: 'em_analise' }));
    await assertFails(updateDoc(doc(as('ana'), 'pets/pub'), { name: 'Hack' }));
  });
  it('favoritos só do próprio usuário', async () => {
    await assertSucceeds(setDoc(doc(as('ana'), 'users/ana/favorites/pub'), { createdAt: 'x' }));
    await assertFails(setDoc(doc(as('bia'), 'users/ana/favorites/pub'), { createdAt: 'x' }));
  });
});

describe('ONG', () => {
  it('lê os próprios pets em análise e não os de outra ONG', async () => {
    await assertSucceeds(getDoc(doc(as('ong1'), 'pets/rev')));
    await assertFails(getDoc(doc(as('ong2'), 'pets/rev')));
  });
  it('cria pet só em análise e só para si', async () => {
    await assertSucceeds(setDoc(doc(as('ong1'), 'pets/n1'), { ...basePet, ongId: 'o1', statusPublicacao: 'em_analise' }));
    await assertFails(setDoc(doc(as('ong1'), 'pets/n2'), { ...basePet, ongId: 'o1', statusPublicacao: 'publicado' }));
    await assertFails(setDoc(doc(as('ong1'), 'pets/n3'), { ...basePet, ongId: 'o2', statusPublicacao: 'em_analise' }));
  });
  it('edição volta para análise; não consegue se autopublicar', async () => {
    await assertFails(updateDoc(doc(as('ong1'), 'pets/rev'), { statusPublicacao: 'publicado' }));
    await assertFails(updateDoc(doc(as('ong1'), 'pets/pub'), { name: 'Luninha' }));
    await assertSucceeds(updateDoc(doc(as('ong1'), 'pets/pub'), { name: 'Luninha', statusPublicacao: 'em_analise' }));
  });
  it('muda só o status de adoção sem voltar para análise', async () => {
    await assertSucceeds(updateDoc(doc(as('ong1'), 'pets/pub'), { status: 'Em Processo', updatedAt: 'x' }));
  });
  it('não edita pet de outra ONG', async () => {
    await assertFails(updateDoc(doc(as('ong2'), 'pets/pub'), { status: 'Adotado', updatedAt: 'x' }));
  });
  it('vê e decide só os pedidos da própria ONG; recusa exige motivo', async () => {
    await assertSucceeds(getDoc(doc(as('ong1'), 'solicitations/s1')));
    await assertFails(getDoc(doc(as('ong2'), 'solicitations/s1')));
    await assertFails(updateDoc(doc(as('ong1'), 'solicitations/s1'), { status: 'rejected' }));
    await assertSucceeds(updateDoc(doc(as('ong1'), 'solicitations/s1'), { status: 'rejected', rejectionReason: 'Moradia sem telas' }));
  });
  it('não aprova a própria ONG', async () => {
    await assertFails(updateDoc(doc(as('ong1'), 'ongs/o1'), { featured: true }));
    await assertSucceeds(updateDoc(doc(as('ong1'), 'ongs/o1'), { name: 'ONG Um' }));
  });
  it('vê pedido de lar temporário pendente e aceita em nome próprio', async () => {
    await assertSucceeds(getDoc(doc(as('ong1'), 'fosterRequests/f1')));
    await assertFails(updateDoc(doc(as('ong1'), 'fosterRequests/f1'), { status: 'accepted', handledByOngId: 'o2' }));
    await assertSucceeds(updateDoc(doc(as('ong1'), 'fosterRequests/f1'), { status: 'accepted', handledByOngId: 'o1' }));
    await assertFails(getDoc(doc(as('ong2'), 'fosterRequests/f1')));
  });
  it('cadastra ONG nova pendente junto com o perfil (batch)', async () => {
    const db = as('nova');
    const b = writeBatch(db);
    b.set(doc(db, 'ongs/o9'), { name: 'Nova', ownerUid: 'nova', status: 'pendente', featured: false });
    b.set(doc(db, 'users/nova'), { role: 'ong', ongId: 'o9', active: true });
    await assertSucceeds(b.commit());
    await assertFails(setDoc(doc(as('outra'), 'ongs/o10'), { name: 'X', ownerUid: 'outra', status: 'aprovada', featured: false }));
  });
});

describe('admin', () => {
  it('publica pets e aprova ONGs', async () => {
    await assertSucceeds(updateDoc(doc(as('adm'), 'pets/rev'), { statusPublicacao: 'publicado' }));
    await assertSucceeds(updateDoc(doc(as('adm'), 'ongs/o3'), { status: 'aprovada' }));
  });
  it('lista todos os pets e usuários e desativa contas', async () => {
    await assertSucceeds(getDocs(collection(as('adm'), 'pets')));
    await assertSucceeds(getDocs(collection(as('adm'), 'users')));
    await assertSucceeds(updateDoc(doc(as('adm'), 'users/ana'), { active: false }));
  });
  it('só o admin escreve parceiros e notícias', async () => {
    await assertSucceeds(setDoc(doc(as('adm'), 'news/n1'), { title: 'Oi' }));
    await assertFails(setDoc(doc(as('ong1'), 'news/n2'), { title: 'Oi' }));
    await assertSucceeds(getDoc(doc(as(), 'news/n1')));
  });
  it('conta desativada perde os poderes de admin', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => updateDoc(doc(ctx.firestore(), 'users/adm'), { active: false }));
    await assertFails(updateDoc(doc(as('adm'), 'pets/rev'), { statusPublicacao: 'publicado' }));
  });
});
