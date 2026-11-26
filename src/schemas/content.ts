import { z } from 'zod';
import { emailSchema } from './common';

export interface Partner {
  id: string;
  name: string;
  category: string;
  tagline: string;
  image: string;
  url: string;
  benefit?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  body: string;
  image: string;
}

export interface Story {
  id: string;
  petName: string;
  adopterName: string;
  title: string;
  quote: string;
  image: string;
  date: string;
}

export interface AppNotification {
  id: string;
  recipientUid: string;
  title: string;
  message: string;
  type: 'adoption_approved' | 'adoption_rejected' | 'adoption_completed' | 'foster_accepted' | 'foster_declined' | 'info';
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export const partnerSchema = z.object({
  name: z.string().trim().min(2),
  category: z.string().trim().min(2),
  tagline: z.string().trim().min(5).max(140),
  image: z.string().url(),
  url: z.string().url(),
  benefit: z.string().trim().max(140).optional().default(''),
});

export const newsSchema = z.object({
  title: z.string().trim().min(5).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tag: z.string().trim().min(2).max(30),
  excerpt: z.string().trim().min(10).max(200),
  body: z.string().trim().min(20),
  image: z.string().url(),
});

export const storySchema = z.object({
  petName: z.string().trim().min(2),
  adopterName: z.string().trim().min(2),
  title: z.string().trim().min(5).max(80),
  quote: z.string().trim().min(10).max(400),
  image: z.string().url(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const donationSchema = z.object({
  amount: z.number({ invalid_type_error: 'Informe um valor' }).min(5, 'O valor mínimo é R$ 5').max(100000),
  frequency: z.enum(['unica', 'mensal']),
  name: z.string().trim().max(80).optional().default(''),
  email: z.union([emailSchema, z.literal('')]).optional().default(''),
});

export const sponsorLeadSchema = z.object({
  name: z.string().trim().min(2, 'Nome da empresa'),
  email: emailSchema,
  message: z.string().trim().min(10, 'Conte como quer apoiar').max(1000),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome'),
  email: emailSchema,
  message: z.string().trim().min(10, 'Escreva sua mensagem').max(3000),
});

export type DonationInput = z.infer<typeof donationSchema>;
