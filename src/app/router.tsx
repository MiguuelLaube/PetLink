import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/components/layout/RootLayout';
import { GuestOnly, RequireRole } from '@/features/auth/RequireRole';
import HomePage from '@/features/home/HomePage';

const page = <T extends Record<string, unknown>>(loader: () => Promise<T>, name: keyof T) =>
  lazy(() => loader().then((m) => ({ default: m[name] as React.ComponentType })));

const CatalogPage = page(() => import('@/features/adocao/CatalogPage'), 'CatalogPage');
const PetDetailPage = page(() => import('@/features/adocao/PetDetailPage'), 'PetDetailPage');
const OngsPage = page(() => import('@/features/ongs/OngsPage'), 'OngsPage');
const OngProfilePage = page(() => import('@/features/ongs/OngProfilePage'), 'OngProfilePage');
const FosterPage = page(() => import('@/features/foster/FosterPage'), 'FosterPage');
const DonatePage = page(() => import('@/features/doacao/DonatePage'), 'DonatePage');
const AboutPage = page(() => import('@/features/institucional/AboutPage'), 'AboutPage');
const ContactPage = page(() => import('@/features/institucional/ContactPage'), 'ContactPage');
const FaqPage = page(() => import('@/features/institucional/FaqPage'), 'FaqPage');
const NewsPage = page(() => import('@/features/institucional/NewsPage'), 'NewsPage');
const NotFoundPage = page(() => import('@/features/institucional/NotFoundPage'), 'NotFoundPage');
const LoginPage = page(() => import('@/features/auth/LoginPage'), 'LoginPage');
const SignupPage = page(() => import('@/features/auth/SignupPage'), 'SignupPage');
const OngSignupPage = page(() => import('@/features/auth/OngSignupPage'), 'OngSignupPage');
const AccountPage = page(() => import('@/features/conta/AccountPage'), 'AccountPage');
const OngDashboardPage = page(() => import('@/features/ong-painel/OngDashboardPage'), 'OngDashboardPage');
const AdminPage = page(() => import('@/features/admin/AdminPage'), 'AdminPage');

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/adocao', element: <CatalogPage /> },
      { path: '/adocao/:id', element: <PetDetailPage /> },
      { path: '/ongs', element: <OngsPage /> },
      { path: '/ongs/:id', element: <OngProfilePage /> },
      { path: '/lar-temporario', element: <FosterPage /> },
      { path: '/doar', element: <DonatePage /> },
      { path: '/sobre', element: <AboutPage /> },
      { path: '/contato', element: <ContactPage /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '/noticias/:id', element: <NewsPage /> },
      { path: '/entrar', element: <GuestOnly><LoginPage /></GuestOnly> },
      { path: '/cadastro', element: <GuestOnly><SignupPage /></GuestOnly> },
      { path: '/cadastro-ong', element: <GuestOnly><OngSignupPage /></GuestOnly> },
      { path: '/minha-conta', element: <RequireRole role="user"><AccountPage /></RequireRole> },
      { path: '/ong/painel', element: <RequireRole role="ong"><OngDashboardPage /></RequireRole> },
      { path: '/admin', element: <RequireRole role="admin"><AdminPage /></RequireRole> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
