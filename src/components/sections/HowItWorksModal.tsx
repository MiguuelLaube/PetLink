import { ClipboardList, HeartHandshake, Home, Search } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ButtonLink } from '@/components/ui/Button';

const STEPS = [
  { icon: Search, title: 'Encontre', text: 'Filtre por espécie, porte, idade e cidade. Cada ficha mostra vacinas, comportamento e a ONG responsável.' },
  { icon: ClipboardList, title: 'Conte sobre você', text: 'Responda o questionário de adoção. Ele ajuda a ONG a entender se o animal combina com a sua rotina.' },
  { icon: HeartHandshake, title: 'Conheça', text: 'A ONG analisa, conversa com você e marca uma visita. Com a aprovação, o contato dela aparece na sua conta.' },
  { icon: Home, title: 'Leve para casa', text: 'Assine o termo de adoção responsável. A ONG acompanha os primeiros meses para garantir que tudo vá bem.' },
];

export function HowItWorksModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Como funciona" description="Da primeira busca ao novo lar, em quatro passos." size="lg"
      footer={<div className="flex justify-end"><ButtonLink to="/adocao" arrow onClick={onClose}>Começar agora</ButtonLink></div>}>
      <video className="mb-6 aspect-video w-full rounded-card bg-[#efe8e2] object-cover" controls muted playsInline preload="none" poster="/brand/splash-poster.webp">
        <source src="/brand/splash.webm" type="video/webm" />
        <source src="/brand/splash.mp4" type="video/mp4" />
      </video>
      <ol className="grid gap-4 sm:grid-cols-2">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="flex gap-3 rounded-card bg-white p-4">
            <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-peach text-primary">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-primary">
                {i + 1}. {title}
              </p>
              <p className="mt-1 text-sm text-text">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Modal>
  );
}
