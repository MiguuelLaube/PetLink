import type { FosterStatus, OngStatus, PublicationStatus, SolicitationStatus } from '@/schemas';

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'primary';

export const SOLICITATION_LABEL: Record<SolicitationStatus, { label: string; tone: Tone }> = {
  pending: { label: 'Enviado', tone: 'info' },
  in_review: { label: 'Em análise', tone: 'warning' },
  approved: { label: 'Aprovado', tone: 'success' },
  rejected: { label: 'Não aprovado', tone: 'danger' },
  completed: { label: 'Adoção concluída', tone: 'primary' },
  canceled: { label: 'Cancelado', tone: 'neutral' },
};

export const FOSTER_LABEL: Record<FosterStatus, { label: string; tone: Tone }> = {
  pending: { label: 'Aguardando ONG', tone: 'warning' },
  accepted: { label: 'Aceito', tone: 'success' },
  declined: { label: 'Não aceito', tone: 'danger' },
};

export const PUBLICATION_LABEL: Record<PublicationStatus, { label: string; tone: Tone }> = {
  em_analise: { label: 'Em análise', tone: 'warning' },
  publicado: { label: 'Publicado', tone: 'success' },
  recusado: { label: 'Recusado', tone: 'danger' },
};

export const ONG_STATUS_LABEL: Record<OngStatus, { label: string; tone: Tone }> = {
  pendente: { label: 'Aguardando validação', tone: 'warning' },
  aprovada: { label: 'Aprovada', tone: 'success' },
  recusada: { label: 'Recusada', tone: 'danger' },
};
