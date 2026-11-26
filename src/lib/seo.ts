import { useEffect } from 'react';

interface Meta {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

/** Atualiza title, description e Open Graph da rota atual. */
export function useDocumentMeta({ title, description, image, type = 'website' }: Meta) {
  useEffect(() => {
    const full = title.includes('PetLink') ? title : `${title} · PetLink`;
    document.title = full;
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', window.location.href);
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:image', image ?? `${window.location.origin}/brand/splash-poster.webp`);
  }, [title, description, image, type]);
}
