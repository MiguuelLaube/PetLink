import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { useDocumentMeta } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';

const FAQ = [
  { id: 'custo', q: 'Adotar tem custo?', a: 'A adoção pelo PetLink é gratuita. Algumas ONGs pedem uma contribuição voluntária para ajudar nos custos de castração e vacinas.' },
  { id: 'tempo', q: 'Quanto tempo leva?', a: 'A ONG costuma responder em até 5 dias úteis. Depois vêm a entrevista, a visita e o termo, o que leva de uma a duas semanas.' },
  { id: 'requisitos', q: 'Quais os requisitos?', a: 'Ser maior de 18 anos, ter documento com foto e comprovante de residência, e concordar com os termos de adoção responsável, incluindo o acompanhamento pós-adoção.' },
  { id: 'devolucao', q: 'E se não der certo?', a: 'Converse com a ONG responsável. O animal nunca deve ser abandonado ou repassado: a ONG ajuda na adaptação ou recebe o animal de volta.' },
  { id: 'ong', q: 'Como minha ONG entra no PetLink?', a: 'Faça o cadastro em “Cadastrar ONG”. A equipe confere o CNPJ e, depois da aprovação, as fichas cadastradas passam pela revisão e entram no catálogo.' },
  { id: 'doacao', q: 'Para onde vai a doação?', a: 'Para as ONGs parceiras, para ração, vacinas, castrações e lares temporários. Hoje o pagamento está em modo de demonstração e nenhum valor é cobrado.' },
  { id: 'privacidade', q: 'Como meus dados são usados? (LGPD)', a: 'Usamos seus dados só para o cadastro e para a análise da adoção. As respostas do questionário são vistas apenas pela ONG responsável pelo animal. O contato da ONG só é liberado para você depois da aprovação. Você pode pedir a exclusão dos seus dados pelo contato.' },
];

export function FaqPage() {
  useDocumentMeta({ title: 'Perguntas frequentes' });
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1)) as HTMLDetailsElement | null;
    if (el) {
      el.open = true;
      el.scrollIntoView({ block: 'center' });
    }
  }, [hash]);
  return (
    <>
      <PageHeader title="Perguntas frequentes" script="Tudo o que você quer saber antes de adotar" />
      <div className="container-page max-w-3xl">
        <ul className="grid gap-3">
          {FAQ.map((f) => (
            <li key={f.id}>
              <details id={f.id} className="group rounded-card bg-white p-5 shadow-soft">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-primary">
                  {f.q}
                  <ChevronDown aria-hidden className="size-5 shrink-0 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-text">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
