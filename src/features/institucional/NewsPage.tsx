import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/dates';
import { useDocumentMeta } from '@/lib/seo';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/PageLoader';
import { useNews, useNewsItem } from './hooks';

export function NewsPage() {
  const { id } = useParams();
  const item = useNewsItem(id);
  const all = useNews();
  useDocumentMeta({ title: item.data?.title ?? 'Notícia', description: item.data?.excerpt, image: item.data?.image, type: 'article' });
  if (item.isLoading) return <PageLoader />;
  if (!item.data) return <div className="container-page py-16"><EmptyState title="Notícia não encontrada" action={<ButtonLink to="/">Voltar ao início</ButtonLink>} /></div>;
  const n = item.data;
  const others = (all.data ?? []).filter((x) => x.id !== n.id).slice(0, 2);
  return (
    <article className="container-page max-w-3xl pt-8">
      <Link to="/#novidades" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"><ArrowLeft aria-hidden className="size-4" /> Novidades</Link>
      <p className="mt-6 text-sm font-semibold text-primary"><time dateTime={n.date}>{formatDate(n.date)}</time> · {n.tag}</p>
      <h1 className="text-h1 mt-2">{n.title}</h1>
      <p className="mt-4 text-lg">{n.excerpt}</p>
      <img src={n.image} alt="" className="mt-8 aspect-[16/9] w-full rounded-block object-cover" />
      <div className="mt-8 grid gap-4 text-text">{n.body.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div>
      {others.length > 0 && (
        <aside className="mt-14 border-t border-line pt-8">
          <h2 className="text-h2">Leia também</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.id}><Link to={`/noticias/${o.id}`} className="block rounded-card bg-white p-4 font-semibold text-primary shadow-soft hover:underline">{o.title}</Link></li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
