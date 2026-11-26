import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { withId } from './helpers';
import { slugId } from '@/lib/id';
import type { DonationInput, NewsItem, Partner, Story } from '@/schemas';

type ContentKind = 'partners' | 'news' | 'stories';
type ContentMap = { partners: Partner; news: NewsItem; stories: Story };

export async function listContent<K extends ContentKind>(kind: K): Promise<ContentMap[K][]> {
  const snap = await getDocs(collection(db, kind));
  const items = snap.docs.map((d) => withId<ContentMap[K]>(d));
  if (kind === 'partners') return items;
  return (items as Array<NewsItem | Story>).sort((a, b) => b.date.localeCompare(a.date)) as ContentMap[K][];
}

export async function getNews(id: string): Promise<NewsItem | null> {
  const snap = await getDoc(doc(db, 'news', id));
  return snap.exists() ? withId<NewsItem>(snap) : null;
}

export async function saveContent<K extends ContentKind>(kind: K, data: Omit<ContentMap[K], 'id'>, id?: string) {
  const docId = id ?? slugId(('title' in data ? data.title : 'name' in data ? data.name : 'item') as string);
  await setDoc(doc(db, kind, docId), data);
  return docId;
}

export async function deleteContent(kind: ContentKind, id: string) {
  await deleteDoc(doc(db, kind, id));
}

// TODO PAGAMENTO: integrar o gateway (Pix / Mercado Pago / Stripe) aqui.
// Hoje a doação é só registrada como "simulado", sem cobrança.
export async function registerDonation(input: DonationInput) {
  await addDoc(collection(db, 'donations'), { ...input, status: 'simulado', createdAt: new Date().toISOString() });
}

export async function sendSponsorLead(data: { name: string; email: string; message: string }) {
  await addDoc(collection(db, 'sponsorLeads'), { ...data, createdAt: new Date().toISOString() });
}

export async function sendContactMessage(data: { name: string; email: string; message: string }) {
  await addDoc(collection(db, 'contactMessages'), { ...data, createdAt: new Date().toISOString() });
}
