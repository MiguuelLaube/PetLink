import type { Pet } from '@/schemas';

export interface PetFilters {
  q: string;
  especie: string[];
  porte: string[];
  idade: string[];
  sexo: string[];
  uf: string;
  cidade: string;
  castrado: boolean;
  especiais: boolean;
  favoritos: boolean;
  ordem: 'recentes' | 'antigos';
}

export const EMPTY_FILTERS: PetFilters = {
  q: '',
  especie: [],
  porte: [],
  idade: [],
  sexo: [],
  uf: '',
  cidade: '',
  castrado: false,
  especiais: false,
  favoritos: false,
  ordem: 'recentes',
};

const LIST_KEYS = ['especie', 'porte', 'idade', 'sexo'] as const;
const BOOL_KEYS = ['castrado', 'especiais', 'favoritos'] as const;

/** Lê os filtros da query string (?especie=Gato,Cachorro&castrado=1...). */
export function filtersFromParams(params: URLSearchParams): PetFilters {
  const f: PetFilters = { ...EMPTY_FILTERS };
  f.q = params.get('q') ?? '';
  f.uf = params.get('uf') ?? '';
  f.cidade = params.get('cidade') ?? '';
  f.ordem = params.get('ordem') === 'antigos' ? 'antigos' : 'recentes';
  for (const k of LIST_KEYS) f[k] = (params.get(k) ?? '').split(',').filter(Boolean);
  for (const k of BOOL_KEYS) f[k] = params.get(k) === '1';
  return f;
}

/** Converte os filtros para query string, omitindo os vazios. */
export function filtersToParams(f: PetFilters, base?: URLSearchParams): URLSearchParams {
  const p = new URLSearchParams(base);
  const set = (k: string, v: string) => (v ? p.set(k, v) : p.delete(k));
  set('q', f.q.trim());
  set('uf', f.uf);
  set('cidade', f.cidade.trim());
  set('ordem', f.ordem === 'antigos' ? 'antigos' : '');
  for (const k of LIST_KEYS) set(k, f[k].join(','));
  for (const k of BOOL_KEYS) set(k, f[k] ? '1' : '');
  return p;
}

export function countActiveFilters(f: PetFilters): number {
  return (
    LIST_KEYS.reduce((n, k) => n + f[k].length, 0) +
    BOOL_KEYS.filter((k) => f[k]).length +
    (f.uf ? 1 : 0) +
    (f.cidade ? 1 : 0)
  );
}

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Aplica todos os filtros combinados e a ordenação. */
export function applyPetFilters(pets: Pet[], f: PetFilters, favoriteIds: Set<string>): Pet[] {
  const q = normalize(f.q.trim());
  const cidade = normalize(f.cidade.trim());
  const result = pets.filter((p) => {
    if (q && !normalize(`${p.name} ${p.breed ?? ''}`).includes(q)) return false;
    if (f.especie.length && !f.especie.includes(p.species)) return false;
    if (f.porte.length && !f.porte.includes(p.size)) return false;
    if (f.idade.length && !f.idade.includes(p.ageGroup)) return false;
    if (f.sexo.length && !f.sexo.includes(p.gender)) return false;
    if (f.uf && p.state !== f.uf) return false;
    if (cidade && !normalize(p.city).includes(cidade)) return false;
    if (f.castrado && !p.castrated) return false;
    if (f.especiais && !p.specialNeeds) return false;
    if (f.favoritos && !favoriteIds.has(p.id)) return false;
    return true;
  });
  return result.sort((a, b) =>
    f.ordem === 'antigos' ? a.entryDate.localeCompare(b.entryDate) : b.entryDate.localeCompare(a.entryDate),
  );
}
