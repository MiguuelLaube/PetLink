import { IMAGES } from '@/lib/images';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal, SectionTitle } from '@/components/ui/Section';

export function FinalCta() {
  return (
    <section aria-labelledby="cta-final" className="container-page mt-24">
      <div className="grid items-center gap-8 rounded-block bg-peach px-5 py-10 md:grid-cols-[1.2fr_1fr] md:px-12">
        <Reveal>
          <SectionTitle id="cta-final">Aqui você encontra seu amigo</SectionTitle>
          <p className="mt-5 max-w-md text-text">
            Cães e gatos de todas as idades, vacinados e acompanhados por ONGs verificadas. Comece pelos filtros e descubra quem combina com
            a sua rotina.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink to="/adocao" arrow>
              Quero adotar
            </ButtonLink>
            <ButtonLink to="/lar-temporario" variant="secondary">
              Oferecer lar temporário
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <img src={IMAGES.finalCta.src} alt={IMAGES.finalCta.alt} loading="lazy" className="aspect-[4/3] w-full rotate-2 rounded-card border-8 border-white object-cover shadow-warm" />
        </Reveal>
      </div>
    </section>
  );
}
