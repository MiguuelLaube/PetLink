import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Heart, Menu, User, X } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { homeFor } from '@/features/auth/RequireRole';
import { cn } from '@/components/ui/cn';

const LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/adocao', label: 'Adotar' },
  { to: '/ongs', label: 'ONGs' },
  { to: '/lar-temporario', label: 'Lar temporário' },
  { to: '/sobre', label: 'Sobre' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, profile } = useAuth();
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const account = user && profile ? { to: homeFor(profile.role), label: profile.role === 'user' ? 'Minha conta' : 'Painel' } : null;

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/90 backdrop-blur">
      <a href="#conteudo" className="sr-only-focusable absolute left-4 top-2 z-50 rounded-full bg-primary px-4 py-2 text-cream">
        Pular para o conteúdo
      </a>
      <nav aria-label="Principal" className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center" aria-label="PetLink, página inicial">
          <img src="/brand/logo-nav.webp" alt="" className="h-11 w-auto" width={72} height={44} />
        </Link>

        <ul className="hidden items-center gap-1 rounded-full bg-white/70 p-1 shadow-soft lg:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn('block rounded-full px-4 py-2 text-sm font-medium transition', isActive ? 'bg-primary text-cream' : 'text-text hover:bg-peach-soft')
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/doar"
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-primary hover:bg-peach-soft sm:flex"
          >
            <Heart aria-hidden className="size-4" /> Doar
          </Link>
          {account ? (
            <Link to={account.to} className="flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-cream hover:bg-primary-hover">
              <User aria-hidden className="size-4" /> {account.label}
            </Link>
          ) : (
            <Link to="/entrar" className="flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-cream hover:bg-primary-hover">
              Entrar
            </Link>
          )}
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-primary hover:bg-peach lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="menu-mobile" className="border-t border-line bg-bg lg:hidden">
          <ul className="container-page flex flex-col gap-1 py-3">
            {[...LINKS, { to: '/doar', label: 'Doar', end: false }].map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    cn('block rounded-card px-4 py-3 font-medium', isActive ? 'bg-primary text-cream' : 'text-text hover:bg-peach-soft')
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
