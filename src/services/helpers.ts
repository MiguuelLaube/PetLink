import type { DocumentData, QueryDocumentSnapshot, DocumentSnapshot } from 'firebase/firestore';

/** Converte um snapshot em objeto com `id`. */
export function withId<T>(snap: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): T {
  return { id: snap.id, ...(snap.data() as object) } as T;
}

/** Remove o id antes de gravar (o id é o nome do documento). */
export function stripId<T extends { id?: string }>(obj: T): Omit<T, 'id'> {
  const { id: _omit, ...rest } = obj;
  void _omit;
  return rest;
}

/** Traduz erros do Firebase para mensagens em pt-BR. */
export function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/user-not-found': 'Não encontramos uma conta com esse e-mail.',
    'auth/email-already-in-use': 'Já existe uma conta com esse e-mail.',
    'auth/weak-password': 'Escolha uma senha mais forte.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
    'auth/requires-recent-login': 'Por segurança, entre de novo antes de fazer essa alteração.',
    'auth/network-request-failed': 'Sem conexão. Verifique a internet e tente de novo.',
    'permission-denied': 'Você não tem permissão para essa ação.',
    'unavailable': 'Serviço indisponível no momento. Tente de novo.',
    'storage/unauthorized': 'Sem permissão para enviar esse arquivo.',
  };
  if (map[code]) return map[code];
  if (err instanceof Error && err.message && !code) return err.message;
  return 'Algo deu errado. Tente de novo.';
}
