import { ButtonLink } from '@/components/ui/Button';
import { HouseFrame } from '@/components/ui/HouseFrame';
import { useDocumentMeta } from '@/lib/seo';

export function NotFoundPage() {
  useDocumentMeta({ title: 'Página não encontrada' });
  return (
    <section className="container-page grid items-center gap-10 py-16 md:grid-cols-2">
      <div>
        <p className="font-display text-[clamp(6rem,20vw,12rem)] leading-none text-primary">404</p>
        <h1 className="text-h2 mt-2">Esse focinho se perdeu</h1>
        <p className="mt-4 max-w-md text-text">
          A página que você procurou não existe ou mudou de endereço. Mas tem muita gente boa esperando por você no catálogo.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink to="/" arrow>
            Voltar ao início
          </ButtonLink>
          <ButtonLink to="/adocao" variant="secondary">
            Ver animais
          </ButtonLink>
        </div>
      </div>
      <HouseFrame
        src="https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=700&h=700&q=75&fm=webp"
        alt="Filhote espiando por cima de uma almofada"
        tone="peach"
        className="mx-auto aspect-square w-full max-w-sm"
      />
    </section>
  );
}
