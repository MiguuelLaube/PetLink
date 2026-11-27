import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/SocialIcons';

const COLS = [
  { title: 'Adote', links: [['Encontrar um pet', '/adocao'], ['ONGs parceiras', '/ongs'], ['Lar temporário', '/lar-temporario']] },
  { title: 'Ajude', links: [['Doar', '/doar'], ['Seja patrocinador', '/doar#patrocinio'], ['Cadastrar ONG', '/cadastro-ong']] },
  { title: 'PetLink', links: [['Sobre nós', '/sobre'], ['Perguntas frequentes', '/faq'], ['Contato', '/contato']] },
] as const;

const SOCIAL = [
  { label: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
  { label: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com' },
  { label: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com' },
  { label: 'Enviar e-mail para o PetLink', icon: Mail, href: 'mailto:contato@petlink.org' },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-cream">
      <div className="bg-orange/90 py-3 text-center text-sm font-semibold text-primary">
        Adotar é um compromisso para a vida toda. Castre, vacine e nunca abandone.
      </div>
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.2fr_2fr]">
        <div>
          <img src="/brand/logo-light.webp" alt="PetLink — Conexão e amor animal" className="h-24 w-auto" width={136} height={96} loading="lazy" />
          <p className="mt-4 max-w-xs text-sm text-cream/80">
            Conectamos ONGs, adotantes e voluntários para que cada cão e gato encontre um lar responsável.
          </p>
          <ul className="mt-5 flex gap-2" aria-label="Redes sociais">
            {SOCIAL.map(({ label, icon: Icon, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full bg-cream/10 hover:bg-cream hover:text-primary">
                  <Icon className="size-4.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-yellow">{c.title}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {c.links.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-cream/85 hover:text-cream hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-cream/15">
        <p className="container-page py-5 text-xs text-cream/70">© {new Date().getFullYear()} PetLink · Feito com amor para quem tem patas.</p>
      </div>
    </footer>
  );
}
