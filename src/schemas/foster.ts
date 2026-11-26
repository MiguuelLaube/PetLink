import { z } from 'zod';
import { phoneSchema, UF } from './common';
import type { OngContact } from './solicitation';

export const FOSTER_STATUS = ['pending', 'accepted', 'declined'] as const;
export type FosterStatus = (typeof FOSTER_STATUS)[number];

export const fosterInputSchema = z.object({
  petName: z.string().trim().min(2, 'Dê um nome provisório'),
  species: z.enum(['Cachorro', 'Gato']),
  size: z.enum(['Pequeno', 'Médio', 'Grande']),
  city: z.string().trim().min(2, 'Cidade'),
  state: z.enum(UF),
  reason: z.string().trim().min(20, 'Descreva a situação (mínimo 20 caracteres)').max(1200),
  phone: phoneSchema,
  consent: z.literal(true, { errorMap: () => ({ message: 'Autorize o contato das ONGs' }) }),
});

export type FosterInput = z.infer<typeof fosterInputSchema>;

export interface FosterRequest extends Omit<FosterInput, 'consent'> {
  id: string;
  requesterUid: string;
  requesterName: string;
  requesterEmail: string;
  photoUrls: string[];
  status: FosterStatus;
  handledByOngId?: string;
  handledByOngName?: string;
  ongContact?: OngContact;
  rejectionReason?: string;
  promotedToPetId?: string;
  createdAt: string;
  updatedAt: string;
}
