import type { z } from 'zod';
import { petInputSchema } from '@/schemas';
import type { UseFormReturn } from 'react-hook-form';

export const petFormSchema = petInputSchema.omit({ mainImage: true, galleryImages: true });
export type PetFormIn = z.input<typeof petFormSchema>;
export type PetFormOut = z.output<typeof petFormSchema>;
export type PetFormApi = UseFormReturn<PetFormIn, unknown, PetFormOut>;

export const STEP_FIELDS: Array<Array<keyof PetFormIn>> = [
  ['name', 'species', 'breed', 'age', 'ageGroup', 'gender', 'size', 'color', 'city', 'state', 'description'],
  ['castrated', 'dataCastracao', 'microchip', 'vacinas', 'vermifugacoes', 'exames'],
  ['comportamento', 'specialNeeds', 'specialNeedsDetails'],
  [],
  [],
];
