import type { ReactNode } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export function ConfirmModal({ open, onClose, title, children, confirmLabel, danger, loading, onConfirm }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; confirmLabel: string; danger?: boolean; loading?: boolean; onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Voltar</Button>
          <Button variant={danger ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      }
    >
      {children}
    </Modal>
  );
}
