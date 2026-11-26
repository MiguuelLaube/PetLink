import { ClipboardCheck, FileSignature, HeartHandshake, MessagesSquare, Search } from 'lucide-react';

const STEPS = [
  { icon: HeartHandshake, title: 'Interesse', text: 'Você envia o questionário pelo botão "Quero adotar".' },
  { icon: Search, title: 'Análise', text: 'A ONG lê suas respostas com calma, em até 5 dias úteis.' },
  { icon: MessagesSquare, title: 'Entrevista e visita', text: 'Conversa por telefone e visita para vocês se conhecerem.' },
  { icon: FileSignature, title: 'Termo', text: 'Assinatura do termo de adoção responsável.' },
  { icon: ClipboardCheck, title: 'Acompanhamento', text: 'A ONG acompanha a adaptação nos primeiros meses.' },
];

export function AdoptionSteps() {
  return (
    <ol className="grid gap-3 sm:grid-cols-5">
      {STEPS.map(({ icon: Icon, title, text }, i) => (
        <li key={title} className="rounded-card bg-white p-4 shadow-soft">
          <span aria-hidden className="grid size-10 place-items-center rounded-full bg-yellow text-primary">
            <Icon className="size-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-primary">
            {i + 1}. {title}
          </p>
          <p className="mt-1 text-xs text-text">{text}</p>
        </li>
      ))}
    </ol>
  );
}

export const ADOPTION_TERMS = [
  'Oferecer alimentação adequada, água limpa, abrigo e carinho todos os dias.',
  'Manter vacinas, vermifugação e consultas veterinárias em dia.',
  'Manter o animal em ambiente seguro: telas em janelas para gatos e portões fechados para cães.',
  'Nunca abandonar, vender ou repassar o animal. Se não puder mais ficar com ele, devolver à ONG.',
  'Permitir o acompanhamento pós-adoção pela ONG responsável.',
  'Usar coleira com identificação e manter o microchip atualizado, quando houver.',
];
