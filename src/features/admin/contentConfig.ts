import { newsSchema, partnerSchema, storySchema } from '@/schemas';

export type ContentKind = 'partners' | 'news' | 'stories';

export interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'url' | 'date' | 'textarea';
  hint?: string;
}

export const CONTENT: Record<ContentKind, { label: string; singular: string; schema: typeof partnerSchema | typeof newsSchema | typeof storySchema; fields: FieldDef[]; title: (d: Record<string, string>) => string; sub: (d: Record<string, string>) => string }> = {
  partners: {
    label: 'Parceiros',
    singular: 'parceiro',
    schema: partnerSchema,
    fields: [
      { name: 'name', label: 'Nome' },
      { name: 'category', label: 'Categoria', hint: 'Ex.: Saúde, Alimentação' },
      { name: 'tagline', label: 'Frase curta' },
      { name: 'benefit', label: 'Benefício para adotantes', hint: 'Opcional' },
      { name: 'url', label: 'Site', type: 'url' },
      { name: 'image', label: 'Imagem (URL)', type: 'url' },
    ],
    title: (d) => d.name,
    sub: (d) => d.category,
  },
  news: {
    label: 'Notícias',
    singular: 'notícia',
    schema: newsSchema,
    fields: [
      { name: 'title', label: 'Título' },
      { name: 'date', label: 'Data', type: 'date' },
      { name: 'tag', label: 'Etiqueta', hint: 'Ex.: Evento, Saúde' },
      { name: 'excerpt', label: 'Resumo', type: 'textarea' },
      { name: 'body', label: 'Texto completo', type: 'textarea', hint: 'Separe parágrafos com uma linha em branco.' },
      { name: 'image', label: 'Imagem (URL)', type: 'url' },
    ],
    title: (d) => d.title,
    sub: (d) => `${d.date} · ${d.tag}`,
  },
  stories: {
    label: 'Histórias',
    singular: 'história',
    schema: storySchema,
    fields: [
      { name: 'title', label: 'Título' },
      { name: 'petName', label: 'Nome do pet' },
      { name: 'adopterName', label: 'Nome de quem adotou' },
      { name: 'quote', label: 'Depoimento', type: 'textarea', hint: 'Use só depoimentos autorizados pela família.' },
      { name: 'date', label: 'Data', type: 'date' },
      { name: 'image', label: 'Imagem (URL)', type: 'url' },
    ],
    title: (d) => d.title,
    sub: (d) => `${d.petName} e ${d.adopterName}`,
  },
};
