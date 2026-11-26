import { IMAGES } from '@/lib/images';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal, SectionTitle } from '@/components/ui/Section';

export function Mission() {
  return (
    <section aria-labelledby="missao" className="container-page mt-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <img
            src={IMAGES.mission.src}
            alt={IMAGES.mission.alt}
            loading="lazy"
            className="aspect-square w-full rounded-block object-cover shadow-warm"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <SectionTitle id="missao" stamp="Salve uma vida" script="Todo focinho merece um lar">
            Nosso lar para patinhas
          </SectionTitle>
          <p className="mt-6 max-w-[52ch] text-text">
            Somos a ponte entre quem resgata e quem quer adotar. Nossa <strong className="text-primary">missão</strong> é simples, mas
            muito importante: ajudar animais em situação difícil a encontrar famílias amorosas. Cada um tem sua própria história e
            nós <strong className="text-primary">acreditamos</strong> que nenhuma delas deve ficar sem ser ouvida.
          </p>
          <ButtonLink to="/sobre" variant="primary" arrow className="mt-8">
            Conheça o PetLink
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
