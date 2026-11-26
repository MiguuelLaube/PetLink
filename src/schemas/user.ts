import { z } from 'zod';
import { emailSchema, phoneSchema } from './common';

export type Role = 'user' | 'ong' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  ongId?: string;
  active: boolean;
  createdAt: string;
}

export const passwordSchema = z
  .string()
  .min(8, 'A senha precisa de pelo menos 8 caracteres')
  .regex(/[A-Za-z]/, 'Use ao menos uma letra')
  .regex(/\d/, 'Use ao menos um número');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe a senha'),
});

export const signupSchema = z
  .object({
    name: z.string().trim().min(3, 'Informe seu nome completo'),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirm: z.string(),
    lgpdConsent: z.literal(true, { errorMap: () => ({ message: 'É preciso aceitar a política de privacidade' }) }),
  })
  .refine((d) => d.password === d.confirm, { path: ['confirm'], message: 'As senhas não conferem' });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
