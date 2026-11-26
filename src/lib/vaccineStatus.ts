import { daysBetween, todayIso } from './dates';

export type DoseStatus = 'em_dia' | 'vence_em_breve' | 'atrasada' | 'sem_reforco';

export const DUE_SOON_DAYS = 30;

/**
 * Calcula o status de uma vacina ou vermifugação a partir do próximo reforço.
 * - atrasada: o reforço já passou
 * - vence_em_breve: faltam até 30 dias (inclusive hoje)
 * - em_dia: faltam mais de 30 dias
 * - sem_reforco: dose única / sem data de reforço
 */
export function doseStatus(nextDate: string | undefined | null, today: string = todayIso()): DoseStatus {
  if (!nextDate) return 'sem_reforco';
  const diff = daysBetween(today, nextDate);
  if (diff < 0) return 'atrasada';
  if (diff <= DUE_SOON_DAYS) return 'vence_em_breve';
  return 'em_dia';
}

export const DOSE_STATUS_LABEL: Record<DoseStatus, string> = {
  em_dia: 'Em dia',
  vence_em_breve: 'Vence em até 30 dias',
  atrasada: 'Atrasada',
  sem_reforco: 'Dose única',
};

/** Resumo geral: o pior status entre todas as doses. */
export function overallDoseStatus(dates: Array<string | undefined | null>, today: string = todayIso()): DoseStatus {
  const statuses = dates.map((d) => doseStatus(d, today));
  if (statuses.includes('atrasada')) return 'atrasada';
  if (statuses.includes('vence_em_breve')) return 'vence_em_breve';
  if (statuses.includes('em_dia')) return 'em_dia';
  return 'sem_reforco';
}
