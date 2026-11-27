import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Textarea } from './Field';

/** Pede um motivo obrigatório antes de uma ação de recusa. */
export function ReasonModal({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  loading,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel: string;
  loading?: boolean;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (open) {
      setReason('');
      setError('');
    }
  }, [open]);
  const confirm = () => {
    if (reason.trim().length < 10) return setError('Explique o motivo em pelo menos 10 caracteres. Ele será enviado para a pessoa.');
    onConfirm(reason.trim());
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Voltar</Button>
          <Button variant="danger" loading={loading} onClick={confirm}>{confirmLabel}</Button>
        </div>
      }
    >
      <Textarea label="Motivo" required rows={4} value={reason} onChange={(e) => setReason(e.target.value)} error={error} data-autofocus />
    </Modal>
  );
}
