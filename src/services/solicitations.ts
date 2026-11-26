import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { withId } from './helpers';
import { historyData, historyDoc, petRef } from './pets';
import { addNotificationToBatch } from './notifications';
import { firstName } from '@/lib/format';
import type { AdoptionQuestionnaire, Ong, Pet, Solicitation, SolicitationStatus } from '@/schemas';

const col = collection(db, 'solicitations');
const solRef = (id: string) => doc(db, 'solicitations', id);
const now = () => new Date().toISOString();

export const OPEN_STATUSES: SolicitationStatus[] = ['pending', 'in_review', 'approved'];

/** Adotante envia o questionário: cria a solicitação e registra no histórico do pet. */
export async function createSolicitation(pet: Pet, form: AdoptionQuestionnaire, adopterUid: string) {
  const ref = doc(col);
  const ts = now();
  const batch = writeBatch(db);
  batch.set(ref, {
    ...form,
    petId: pet.id,
    petName: pet.name,
    petImage: pet.mainImage,
    ongId: pet.ongId,
    ongName: pet.ongName,
    adopterUid,
    status: 'pending',
    createdAt: ts,
    updatedAt: ts,
  });
  batch.set(
    historyDoc(pet.id),
    historyData({
      type: 'solicitacao_adocao',
      title: 'Novo pedido de adoção',
      description: `${firstName(form.requesterName)} demonstrou interesse e enviou o questionário.`,
      actorName: firstName(form.requesterName),
      actorRole: 'adotante',
      actorUid: adopterUid,
    }),
  );
  await batch.commit();
  return ref.id;
}

export async function listMySolicitations(uid: string): Promise<Solicitation[]> {
  const snap = await getDocs(query(col, where('adopterUid', '==', uid)));
  return snap.docs.map((d) => withId<Solicitation>(d)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listOngSolicitations(ongId: string): Promise<Solicitation[]> {
  const snap = await getDocs(query(col, where('ongId', '==', ongId)));
  return snap.docs.map((d) => withId<Solicitation>(d)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAllSolicitations(): Promise<Solicitation[]> {
  const snap = await getDocs(col);
  return snap.docs.map((d) => withId<Solicitation>(d));
}

interface OngActor {
  ong: Ong;
  uid: string;
}

export async function markInReview(sol: Solicitation) {
  const batch = writeBatch(db);
  batch.update(solRef(sol.id), { status: 'in_review', updatedAt: now() });
  await batch.commit();
}

/** ONG aprova: libera o contato para o adotante e o pet fica "Em Processo". */
export async function approveSolicitation(sol: Solicitation, { ong, uid }: OngActor) {
  const batch = writeBatch(db);
  batch.update(solRef(sol.id), {
    status: 'approved',
    ongContact: { phone: ong.phone, email: ong.email, address: `${ong.address}, ${ong.city} - ${ong.state}` },
    updatedAt: now(),
  });
  batch.update(petRef(sol.petId), { status: 'Em Processo', updatedAt: now() });
  batch.set(
    historyDoc(sol.petId),
    historyData({
      type: 'adocao_aprovada',
      title: 'Pedido aprovado',
      description: `A ONG aprovou o pedido de ${firstName(sol.requesterName)}. Agora vem a entrevista, a visita e o termo.`,
      actorName: ong.name,
      actorRole: 'ong',
      actorUid: uid,
    }),
  );
  addNotificationToBatch(batch, {
    recipientUid: sol.adopterUid,
    type: 'adoption_approved',
    title: `Pedido aprovado: ${sol.petName}`,
    message: `A ${ong.name} aprovou seu pedido. O contato da ONG já está liberado em Minhas adoções.`,
    relatedId: sol.id,
  });
  await batch.commit();
}

/** ONG recusa (motivo obrigatório). Se o pedido estava aprovado, o pet volta a "Disponível". */
export async function rejectSolicitation(sol: Solicitation, reason: string, { ong, uid }: OngActor) {
  const batch = writeBatch(db);
  batch.update(solRef(sol.id), { status: 'rejected', rejectionReason: reason, updatedAt: now() });
  if (sol.status === 'approved') batch.update(petRef(sol.petId), { status: 'Disponível', updatedAt: now() });
  batch.set(
    historyDoc(sol.petId),
    historyData({
      type: 'adocao_negada',
      title: 'Pedido não aprovado',
      description: `O pedido de ${firstName(sol.requesterName)} não seguiu adiante.`,
      actorName: ong.name,
      actorRole: 'ong',
      actorUid: uid,
    }),
  );
  addNotificationToBatch(batch, {
    recipientUid: sol.adopterUid,
    type: 'adoption_rejected',
    title: `Pedido não aprovado: ${sol.petName}`,
    message: `A ${ong.name} analisou seu pedido e não pôde aprová-lo. Motivo: ${reason}`,
    relatedId: sol.id,
  });
  await batch.commit();
}

/**
 * ONG conclui a adoção: o pet vira "Adotado" e os outros pedidos abertos
 * para o mesmo pet são encerrados com aviso aos adotantes.
 */
export async function completeAdoption(sol: Solicitation, others: Solicitation[], { ong, uid }: OngActor) {
  const batch = writeBatch(db);
  batch.update(solRef(sol.id), { status: 'completed', updatedAt: now() });
  batch.update(petRef(sol.petId), { status: 'Adotado', updatedAt: now() });
  batch.set(
    historyDoc(sol.petId),
    historyData({
      type: 'adocao_concluida',
      title: 'Adoção concluída',
      description: `${sol.petName} foi para o novo lar com ${firstName(sol.requesterName)}. O acompanhamento pós-adoção começa agora.`,
      actorName: ong.name,
      actorRole: 'ong',
      actorUid: uid,
    }),
  );
  addNotificationToBatch(batch, {
    recipientUid: sol.adopterUid,
    type: 'adoption_completed',
    title: `Bem-vindo(a) à família, ${sol.petName}!`,
    message: `A ${ong.name} registrou a adoção como concluída. Obrigado por adotar com responsabilidade.`,
    relatedId: sol.id,
  });
  for (const o of others.filter((x) => x.id !== sol.id && x.petId === sol.petId && OPEN_STATUSES.includes(x.status))) {
    const reason = `${sol.petName} foi adotado(a) por outra família.`;
    batch.update(solRef(o.id), { status: 'rejected', rejectionReason: reason, updatedAt: now() });
    addNotificationToBatch(batch, {
      recipientUid: o.adopterUid,
      type: 'adoption_rejected',
      title: `Pedido encerrado: ${o.petName}`,
      message: `${reason} Que tal conhecer outros animais no catálogo?`,
      relatedId: o.id,
    });
  }
  await batch.commit();
}

/** Adotante desiste do pedido. */
export async function cancelSolicitation(sol: Solicitation) {
  const batch = writeBatch(db);
  batch.update(solRef(sol.id), { status: 'canceled', updatedAt: now() });
  await batch.commit();
}
