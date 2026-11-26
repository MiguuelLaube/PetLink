/**
 * Popula os emulators do Firebase com dados de demonstração.
 * Uso: `npm run emulators` em um terminal e `npm run seed` em outro.
 * NUNCA rode contra um projeto real: as senhas abaixo são só para uso local.
 */
const PROJECT = process.env.GCLOUD_PROJECT || 'demo-petlink';
process.env.FIRESTORE_EMULATOR_HOST ||= '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST ||= '127.0.0.1:9099';

import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { LOCAL_PASSWORD, USERS } from './seed-data/people';
import { ONGS } from './seed-data/ongs';
import { PETS } from './seed-data/pets';
import { NEWS, PARTNERS, STORIES } from './seed-data/content';

if (!PROJECT.startsWith('demo-')) {
  console.error('O seed só roda em projetos "demo-*" (emulators).');
  process.exit(1);
}

initializeApp({ projectId: PROJECT });
const auth = getAuth();
const db = getFirestore();
const iso = (days: number) => new Date(Date.now() + days * 86400000).toISOString();

async function reset() {
  const fs = process.env.FIRESTORE_EMULATOR_HOST;
  const au = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  await fetch(`http://${fs}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: 'DELETE' });
  await fetch(`http://${au}/emulator/v1/projects/${PROJECT}/accounts`, { method: 'DELETE' });
}

async function main() {
  await reset();
  const uids: Record<string, string> = {};

  for (const u of USERS) {
    const rec = await auth.createUser({ email: u.email, password: LOCAL_PASSWORD, displayName: u.name, emailVerified: true });
    uids[u.key] = rec.uid;
    await db.doc(`users/${rec.uid}`).set({
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      ...('ongId' in u ? { ongId: u.ongId } : {}),
      active: true,
      createdAt: iso(-200),
    });
  }

  const ongById = new Map(ONGS.map((o) => [o.id, o]));
  for (const { owner, id, ...ong } of ONGS) {
    await db.doc(`ongs/${id}`).set({ ...ong, ownerUid: uids[owner], createdAt: iso(-365) });
  }

  for (const { id, ...pet } of PETS) {
    const ong = ongById.get(pet.ongId)!;
    const createdAt = `${pet.entryDate}T12:00:00.000Z`;
    await db.doc(`pets/${id}`).set({ ...pet, ongName: ong.name, motivoRecusa: null, createdAt, updatedAt: createdAt });
    const hist = db.collection(`pets/${id}/history`);
    await hist.add({ type: 'cadastro_ong', title: 'Cadastrado pela ONG', description: `${pet.name} foi resgatado(a) e cadastrado(a) pela ${ong.name}.`, actorName: ong.name, actorRole: 'ong', date: createdAt });
    if (pet.statusPublicacao === 'publicado') {
      await hist.add({ type: 'publicacao', title: 'Publicado no catálogo', description: 'A ficha foi revisada pela equipe PetLink e está visível para adoção.', actorName: 'Equipe PetLink', actorRole: 'admin', date: new Date(Date.parse(createdAt) + 86400000).toISOString() });
    }
  }

  const quest = {
    housingType: 'Casa com quintal', housingSafe: 'Sim', hasOtherPets: 'Uma gata castrada de 6 anos', hasChildrenOrElderly: 'Não',
    hoursAlone: 'De 4 a 8 horas', visitPreference: 'Fim de semana', notes: '', acceptTerms: true, lgpdConsent: true,
  };
  const ana = USERS.find((u) => u.key === 'adotante')!;
  const carla = USERS.find((u) => u.key === 'carla')!;
  const sols = [
    { id: 'sol-tomas-carla', pet: 'tomas', who: carla, uid: uids.carla, status: 'pending', created: -2 },
    { id: 'sol-thor-ana', pet: 'thor', who: ana, uid: uids.adotante, status: 'approved', created: -9 },
    { id: 'sol-amora-carla', pet: 'amora', who: carla, uid: uids.carla, status: 'completed', created: -40 },
  ];
  for (const s of sols) {
    const pet = PETS.find((p) => p.id === s.pet)!;
    const ong = ongById.get(pet.ongId)!;
    await db.doc(`solicitations/${s.id}`).set({
      ...quest,
      requesterName: s.who.name, email: s.who.email, phone: s.who.phone,
      petId: pet.id, petName: pet.name, petImage: pet.mainImage, ongId: ong.id, ongName: ong.name,
      adopterUid: s.uid, status: s.status, createdAt: iso(s.created), updatedAt: iso(s.created + 1),
      ...(s.status !== 'pending' ? { ongContact: { phone: ong.phone, email: ong.email, address: `${ong.address}, ${ong.city} - ${ong.state}` } } : {}),
    });
    const first = s.who.name.split(' ')[0];
    const hist = db.collection(`pets/${pet.id}/history`);
    await hist.add({ type: 'solicitacao_adocao', title: 'Novo pedido de adoção', description: `${first} demonstrou interesse e enviou o questionário.`, actorName: first, actorRole: 'adotante', date: iso(s.created) });
    if (s.status === 'approved' || s.status === 'completed') {
      await hist.add({ type: 'adocao_aprovada', title: 'Pedido aprovado', description: `A ONG aprovou o pedido de ${first}. Agora vem a entrevista, a visita e o termo.`, actorName: ong.name, actorRole: 'ong', date: iso(s.created + 1) });
    }
    if (s.status === 'completed') {
      await hist.add({ type: 'adocao_concluida', title: 'Adoção concluída', description: `${pet.name} foi para o novo lar com ${first}.`, actorName: ong.name, actorRole: 'ong', date: iso(s.created + 7) });
    }
  }
  await db.collection('notifications').add({
    recipientUid: uids.adotante, type: 'adoption_approved', title: 'Pedido aprovado: Thor',
    message: 'A SOS Focinhos aprovou seu pedido. O contato da ONG já está liberado em Minhas adoções.', relatedId: 'sol-thor-ana', read: false, createdAt: iso(-8),
  });

  await db.doc('fosterRequests/foster-praca').set({
    petName: 'Pretinha', species: 'Cachorro', size: 'Médio', city: 'São Paulo', state: 'SP',
    reason: 'Cachorra dócil aparece há uma semana na praça do bairro, magra e com uma ferida na pata traseira. Posso levar até a ONG.',
    phone: carla.phone, photoUrls: [], requesterUid: uids.carla, requesterName: carla.name, requesterEmail: carla.email,
    status: 'pending', createdAt: iso(-1), updatedAt: iso(-1),
  });

  for (const p of PARTNERS) { const { id, ...rest } = p; await db.doc(`partners/${id}`).set(rest); }
  for (const n of NEWS) { const { id, ...rest } = n; await db.doc(`news/${id}`).set(rest); }
  for (const s of STORIES) { const { id, ...rest } = s; await db.doc(`stories/${id}`).set(rest); }

  console.log(`Seed concluído: ${USERS.length} usuários, ${ONGS.length} ONGs, ${PETS.length} pets.`);
  console.log(`Logins locais (senha ${LOCAL_PASSWORD}): adotante@petlink.local, ong@petlink.local, admin@petlink.local`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
