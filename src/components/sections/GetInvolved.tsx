import { Link } from 'react-router';
import { BookHeart, HandHeart, Home, PackageOpen } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { HouseFrame } from '@/components/ui/HouseFrame';
import { Reveal, SectionTitle } from '@/components/ui/Section';
import { cn } from '@/components/ui/cn';

const BUBBLES = [
  { icon: HandHeart, title: 'Voluntariado', text: 'Passeios, banhos e feiras de adoção', to: '/contato?assunto=voluntariado', tone: 'bg-yellow', pos: 'lg:left-0 lg:top-6' },
  { icon: PackageOpen, title: 'Doação de ração e itens', text: 'Ração, cobertores, caminhas e remédios', to: '/doar', tone: 'bg-blue', pos: 'lg:right-0 lg:top-0' },
  { icon: Home, title: 'Adoção', text: 'Dê um lar para quem espera', to: '/adocao', tone: 'bg-white', pos: 'lg:left-6 lg:bottom-8' },
  { icon: BookHeart, title: 'Histórias de sucesso', text: 'Veja quem já encontrou família', to: '/sobre#historias', tone: 'bg-peach', pos: 'lg:right-4 lg:bottom-4' },
];

export function GetInvolved() {
  return (
    <section aria-labelledby="envolva-se" className="container-page mt-24">
      <SectionTitle id="envolva-se" stamp="Faça parte" align="center" className="mx-auto">
        Envolva-se
      </SectionTitle>
      <div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:block lg:h-[30rem]">
        <Reveal className="sm:col-span-2 lg:absolute lg:left-1/2 lg:top-0 lg:w-80 lg:-translate-x-1/2">
          <HouseFrame src={IMAGES.involved.src} alt={IMAGES.involved.alt} tone="yellow" className="mx-auto aspect-[7/8] w-64 lg:w-80" />
        </Reveal>
        {BUBBLES.map(({ icon: Icon, title, text, to, tone, pos }) => (
          <Link
            key={title}
            to={to}
            className={cn(
              'flex items-start gap-3 rounded-card p-4 shadow-warm transition hover:-translate-y-1 hover:shadow-lift lg:absolute lg:w-72',
              tone,
              pos,
            )}
          >
            <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-cream">
              <Icon className="size-5" />
            </span>
            <span>
              <span className="block font-semibold text-primary">{title}</span>
              <span className="text-sm text-text">{text}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
