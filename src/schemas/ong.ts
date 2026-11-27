import { z } from 'zod';
import { emailSchema, phoneSchema, UF } from './common';
import { isValidCnpj } from '@/lib/cnpj';

export type OngStatus = 'pendente' | 'aprovada' | 'recusada';

export const ongProfileSchema = z.object({
  name: z.string().trim().min(3, 'Nome da ONG'),
  cnpj: z.string().trim().refine(isValidCnpj, 'CNPJ inválido'),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().trim().min(8, 'Endereço completo'),
  city: z.string().trim().min(2, 'Cidade'),
  state: z.enum(UF),
  description: z.string().trim().min(30, 'Descreva a ONG (mínimo 30 caracteres)').max(800),
  logoUrl: z.string().url().or(z.literal('')).optional().default(''),
});

export type OngProfileInput = z.infer<typeof ongProfileSchema>;

export interface Ong extends OngProfileInput {
  id: string;
  ownerUid: string;
  status: OngStatus;
  featured: boolean;
  motivoRecusa?: string;
  createdAt: string;
}
