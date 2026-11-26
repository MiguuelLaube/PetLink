import { describe, expect, it } from 'vitest';
import { doseStatus, overallDoseStatus } from '../src/lib/vaccineStatus';
import { isValidCnpj } from '../src/lib/cnpj';
import { applyPetFilters, filtersFromParams, filtersToParams } from '../src/lib/filters';
import type { Pet } from '../src/schemas';

const TODAY = '2026-11-26';

describe('doseStatus', () => {
  it('marca como atrasada quando o reforço já passou', () => {
    expect(doseStatus('2026-11-25', TODAY)).toBe('atrasada');
    expect(doseStatus('2025-01-01', TODAY)).toBe('atrasada');
  });
  it('marca como vence em breve entre hoje e 30 dias', () => {
    expect(doseStatus('2026-11-26', TODAY)).toBe('vence_em_breve');
    expect(doseStatus('2026-12-26', TODAY)).toBe('vence_em_breve');
  });
  it('marca como em dia acima de 30 dias', () => {
    expect(doseStatus('2026-12-27', TODAY)).toBe('em_dia');
  });
  it('sem data de reforço é dose única', () => {
    expect(doseStatus('', TODAY)).toBe('sem_reforco');
    expect(doseStatus(undefined, TODAY)).toBe('sem_reforco');
  });
  it('o resumo usa o pior status', () => {
    expect(overallDoseStatus(['2027-06-01', '2026-12-01'], TODAY)).toBe('vence_em_breve');
    expect(overallDoseStatus(['2027-06-01', '2026-01-01'], TODAY)).toBe('atrasada');
    expect(overallDoseStatus([], TODAY)).toBe('sem_reforco');
  });
});

describe('isValidCnpj', () => {
  it('aceita CNPJ válido com e sem máscara', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
    expect(isValidCnpj('11222333000181')).toBe(true);
  });
  it('recusa dígitos errados e sequências repetidas', () => {
    expect(isValidCnpj('11.222.333/0001-82')).toBe(false);
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false);
    expect(isValidCnpj('123')).toBe(false);
  });
});

describe('filtros do catálogo', () => {
  const pet = (p: Partial<Pet>) =>
    ({ id: p.name, name: 'X', breed: 'SRD', species: 'Cachorro', size: 'Médio', ageGroup: 'Adulto', gender: 'Macho', state: 'SP', city: 'São Paulo', castrated: true, specialNeeds: false, entryDate: '2026-01-01', ...p }) as Pet;
  const pets = [
    pet({ name: 'Luna', species: 'Gato', size: 'Pequeno', gender: 'Fêmea', entryDate: '2026-03-01' }),
    pet({ name: 'Max', size: 'Grande', castrated: false, entryDate: '2026-02-01' }),
    pet({ name: 'Nina', size: 'Pequeno', gender: 'Fêmea', specialNeeds: true, state: 'RJ', city: 'Rio de Janeiro', entryDate: '2026-01-01' }),
  ];

  it('ida e volta pela URL preserva os filtros', () => {
    const f = filtersFromParams(new URLSearchParams('especie=Cachorro,Gato&porte=Pequeno&castrado=1&ordem=antigos&q=lu'));
    expect(f.especie).toEqual(['Cachorro', 'Gato']);
    expect(f.castrado).toBe(true);
    expect(filtersFromParams(filtersToParams(f))).toEqual(f);
  });

  it('combina filtros', () => {
    const f = filtersFromParams(new URLSearchParams('porte=Pequeno&sexo=Fêmea&uf=RJ'));
    expect(applyPetFilters(pets, f, new Set()).map((p) => p.name)).toEqual(['Nina']);
  });

  it('busca sem acento e ordena', () => {
    const f = filtersFromParams(new URLSearchParams('ordem=antigos'));
    expect(applyPetFilters(pets, f, new Set()).map((p) => p.name)).toEqual(['Nina', 'Max', 'Luna']);
    const g = filtersFromParams(new URLSearchParams('q=LÚNA'));
    expect(applyPetFilters(pets, g, new Set()).map((p) => p.name)).toEqual(['Luna']);
  });

  it('filtra favoritos', () => {
    const f = filtersFromParams(new URLSearchParams('favoritos=1'));
    expect(applyPetFilters(pets, f, new Set(['Max'])).map((p) => p.name)).toEqual(['Max']);
  });
});
