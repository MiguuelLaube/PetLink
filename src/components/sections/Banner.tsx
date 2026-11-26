import { IMAGES } from '@/lib/images';
import { Stamp } from '@/components/ui/Stamp';
import { ButtonLink } from '@/components/ui/Button';

export function Banner() {
  return (
    <section aria-labelledby="banner-title" className="container-page mt-24">
      <div className="relative overflow-hidden rounded-block">
        <img src={IMAGES.banner.src} alt={IMAGES.banner.alt} loading="lazy" className="h-80 w-full object-cover md:h-[26rem]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 p-6 text-center md:p-10">
          <h2 id="banner-title" className="text-h1 relative text-cream">
            Tenha o pet
            <br />
            dos seus sonhos
            <Stamp className="absolute -right-2 -top-6 sm:-right-14">Seu novo amigo</Stamp>
          </h2>
          <ButtonLink to="/adocao" variant="light" arrow>
            Ver quem espera por você
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
