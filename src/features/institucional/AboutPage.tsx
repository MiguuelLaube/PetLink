import { Quote } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { useDocumentMeta } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useApprovedOngs } from '@/features/ongs/hooks';
import { usePublishedPets } from '@/features/adocao/hooks';
import { useStories } from './hooks';

const VALUES = [
  { title: 'Adoção responsável', text: 'Questionário, entrevista e termo para que a adoção dure a vida toda.' },
  { title: 'ONGs verificadas', text: 'Validamos o CNPJ de cada organização e revisamos cada ficha antes de publicar.' },
  { title: 'Transparência', text: 'Vacinas, exames e a linha do tempo de cada animal ficam abertos para quem quer adotar.' },
];

export function AboutPage() {
  useDocumentMeta({ title: 'Sobre o PetLink', description: 'Conheça a missão do PetLink e as histórias de quem adotou.' });
  const ongs = useApprovedOngs();
  const pets = usePublishedPets();
  const stories = useStories();
  const waiting = pets.data?.filter((p) => p.status !== 'Adotado').length;
  const adopted = pets.data?.filter((p) => p.status === 'Adotado').length;

  return (
    <>
      <PageHeader title="Conexão e amor animal" stamp="Sobre nós" script="Por trás de cada focinho">
        O PetLink nasceu para encurtar o caminho entre quem resgata e quem quer adotar, com informação clara e cuidado em cada etapa.
      </PageHeader>
      <div className="container-page grid items-center gap-10 md:grid-cols-2">
        <img src={IMAGES.about.src} alt={IMAGES.about.alt} loading="lazy" className="aspect-[10/7] w-full rounded-block object-cover shadow-warm" />
        <ul className="grid gap-4">
          {VALUES.map((v) => (
            <li key={v.title} className="rounded-card bg-white p-5 shadow-soft">
              <p className="font-semibold text-primary">{v.title}</p>
              <p className="mt-1 text-sm">{v.text}</p>
            </li>
          ))}
        </ul>
      </div>
      <section aria-label="Números de hoje" className="container-page mt-14 grid gap-4 sm:grid-cols-3">
        <StatCard label="ONGs verificadas" value={ongs.data?.length ?? '—'} tone="bg-yellow" />
        <StatCard label="Esperando um lar" value={waiting ?? '—'} tone="bg-peach" />
        <StatCard label="Adotados pelo site" value={adopted ?? '—'} tone="bg-blue" />
      </section>
      <section id="historias" aria-labelledby="historias-t" className="container-page mt-20 scroll-mt-24">
        <h2 id="historias-t" className="text-h1">Finais felizes</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {stories.isLoading
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-96" />)
            : stories.data?.map((s) => (
                <figure key={s.id} className="overflow-hidden rounded-card bg-white shadow-warm">
                  <img src={s.image} alt={`${s.petName} no novo lar`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <div className="p-5">
                    <h3 className="font-semibold text-primary">{s.title}</h3>
                    <blockquote className="mt-2 text-sm"><Quote aria-hidden className="mb-1 size-4 text-orange" />{s.quote}</blockquote>
                    <figcaption className="mt-3 text-xs text-text-muted">{s.adopterName}, tutor(a) de {s.petName}</figcaption>
                  </div>
                </figure>
              ))}
        </div>
        <div className="mt-10 flex justify-center"><ButtonLink to="/adocao" arrow>Escrever a próxima história</ButtonLink></div>
      </section>
    </>
  );
}
