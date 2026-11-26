import { z } from 'zod';
import { isoDate, optionalIsoDate, UF } from './common';

export const SPECIES = ['Cachorro', 'Gato'] as const;
export const SIZES = ['Pequeno', 'Médio', 'Grande'] as const;
export const GENDERS = ['Macho', 'Fêmea'] as const;
export const AGE_GROUPS = ['Filhote', 'Adulto', 'Idoso'] as const;
export const PET_STATUS = ['Disponível', 'Em Processo', 'Adotado'] as const;
export const PUBLICATION_STATUS = ['em_analise', 'publicado', 'recusado'] as const;
export const YES_NO_UNKNOWN = ['Sim', 'Não', 'Não testado'] as const;
export const ENERGY = ['Baixa', 'Média', 'Alta'] as const;

export const vaccineSchema = z.object({
  nome: z.string().trim().min(2, 'Nome da vacina'),
  dataAplicada: isoDate,
  proximoReforco: optionalIsoDate,
});

export const dewormingSchema = z.object({
  produto: z.string().trim().min(2, 'Produto'),
  data: isoDate,
  proximo: optionalIsoDate,
});

export const examSchema = z.object({
  nome: z.string().trim().min(2, 'Nome do exame'),
  data: isoDate,
  resultado: z.string().trim().min(1, 'Resultado'),
});

export const behaviorSchema = z.object({
  criancas: z.enum(YES_NO_UNKNOWN),
  outrosAnimais: z.enum(YES_NO_UNKNOWN),
  energia: z.enum(ENERGY),
});

/** Campos que a ONG preenche no formulário em etapas. */
export const petInputSchema = z.object({
  name: z.string().trim().min(2, 'Nome com pelo menos 2 letras').max(60),
  species: z.enum(SPECIES),
  breed: z.string().trim().max(60).optional().default('SRD'),
  age: z.string().trim().min(1, 'Informe a idade aproximada, ex.: 2 anos'),
  ageGroup: z.enum(AGE_GROUPS),
  gender: z.enum(GENDERS),
  size: z.enum(SIZES),
  color: z.string().trim().max(40).optional().default(''),
  city: z.string().trim().min(2, 'Cidade'),
  state: z.enum(UF),
  description: z.string().trim().min(20, 'Conte um pouco mais (mínimo 20 caracteres)').max(1200),
  castrated: z.boolean(),
  dataCastracao: optionalIsoDate,
  microchip: z.string().trim().max(30).optional().default(''),
  specialNeeds: z.boolean(),
  specialNeedsDetails: z.string().trim().max(300).optional().default(''),
  vacinas: z.array(vaccineSchema).max(20),
  vermifugacoes: z.array(dewormingSchema).max(20),
  exames: z.array(examSchema).max(20),
  comportamento: behaviorSchema,
  mainImage: z.string().url('Envie ao menos uma foto'),
  galleryImages: z.array(z.string().url()).max(5),
});

export type PetInput = z.infer<typeof petInputSchema>;
export type Vaccine = z.infer<typeof vaccineSchema>;
export type Deworming = z.infer<typeof dewormingSchema>;
export type Exam = z.infer<typeof examSchema>;
export type PetStatus = (typeof PET_STATUS)[number];
export type PublicationStatus = (typeof PUBLICATION_STATUS)[number];

export interface Pet extends PetInput {
  id: string;
  ongId: string;
  ongName: string;
  status: PetStatus;
  statusPublicacao: PublicationStatus;
  motivoRecusa?: string | null;
  originFosterId?: string;
  entryDate: string;
  createdAt: string;
  updatedAt: string;
}

export type HistoryType =
  | 'triagem_acolhimento'
  | 'cadastro_ong'
  | 'publicacao'
  | 'solicitacao_adocao'
  | 'adocao_aprovada'
  | 'adocao_negada'
  | 'adocao_concluida'
  | 'adocao_cancelada'
  | 'edicao_dados';

export interface HistoryEntry {
  id: string;
  date: string;
  type: HistoryType;
  title: string;
  description: string;
  actorName: string;
  actorRole: 'ong' | 'adotante' | 'admin' | 'sistema';
  actorUid?: string;
}
