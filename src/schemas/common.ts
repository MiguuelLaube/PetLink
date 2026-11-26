import { z } from 'zod';

export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD');
export const optionalIsoDate = z.union([isoDate, z.literal('')]).optional();

export const UF = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
] as const;

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/, 'Informe um telefone com DDD, ex.: (11) 98765-4321');

export const emailSchema = z.string().trim().toLowerCase().email('Informe um e-mail válido');
