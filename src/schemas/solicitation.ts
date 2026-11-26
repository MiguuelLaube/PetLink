import { z } from 'zod';
import { emailSchema, phoneSchema } from './common';

export const SOLICITATION_STATUS = ['pending', 'in_review', 'approved', 'rejected', 'completed', 'canceled'] as const;
export type SolicitationStatus = (typeof SOLICITATION_STATUS)[number];

export const HOUSING = ['Casa com quintal', 'Casa sem quintal', 'Apartamento', 'Chácara ou sítio'] as const;
export const HOURS_ALONE = ['Menos de 4 horas', 'De 4 a 8 horas', 'Mais de 8 horas'] as const;
export const VISIT_PREF = ['Manhã', 'Tarde', 'Fim de semana', 'Online primeiro'] as const;

export const adoptionQuestionnaireSchema = z.object({
  requesterName: z.string().trim().min(3, 'Informe seu nome completo'),
  email: emailSchema,
  phone: phoneSchema,
  housingType: z.enum(HOUSING, { errorMap: () => ({ message: 'Escolha o tipo de moradia' }) }),
  housingSafe: z.enum(['Sim', 'Não', 'Vou adaptar'], { errorMap: () => ({ message: 'Responda sobre telas e portões' }) }),
  hasOtherPets: z.string().trim().min(2, 'Conte se há outros animais (ou escreva "Não")'),
  hasChildrenOrElderly: z.string().trim().min(2, 'Conte se há crianças ou idosos (ou escreva "Não")'),
  hoursAlone: z.enum(HOURS_ALONE, { errorMap: () => ({ message: 'Escolha uma opção' }) }),
  visitPreference: z.enum(VISIT_PREF, { errorMap: () => ({ message: 'Escolha uma opção' }) }),
  notes: z.string().trim().max(1000).optional().default(''),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Aceite os termos de adoção responsável' }) }),
  lgpdConsent: z.literal(true, { errorMap: () => ({ message: 'Autorize o uso dos dados para a análise' }) }),
});

export type AdoptionQuestionnaire = z.infer<typeof adoptionQuestionnaireSchema>;

export interface OngContact {
  phone: string;
  email: string;
  address: string;
}

export interface Solicitation extends Omit<AdoptionQuestionnaire, 'acceptTerms'> {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  ongId: string;
  ongName: string;
  adopterUid: string;
  acceptTerms: true;
  status: SolicitationStatus;
  rejectionReason?: string;
  ongContact?: OngContact;
  createdAt: string;
  updatedAt: string;
}
