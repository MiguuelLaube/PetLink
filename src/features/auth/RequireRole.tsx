import type { ReactNode } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router';
import type { Role } from '@/schemas';
import { useAuth } from './AuthContext';
import { PageLoader } from '@/components/ui/PageLoader';

/** Protege uma rota por perfil. Sem login, manda para /entrar e volta depois. */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to={`/entrar?voltar=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  if (profile?.role !== role) return <Navigate to={homeFor(profile?.role)} replace />;
  return <>{children}</>;
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const [params] = useSearchParams();
  if (user && profile) {
    const back = params.get('voltar');
    return <Navigate to={back && back.startsWith('/') ? back : homeFor(profile.role)} replace />;
  }
  if (loading && !user) return <PageLoader />;
  return <>{children}</>;
}

export function homeFor(role?: Role): string {
  if (role === 'admin') return '/admin';
  if (role === 'ong') return '/ong/painel';
  if (role === 'user') return '/minha-conta';
  return '/';
}
