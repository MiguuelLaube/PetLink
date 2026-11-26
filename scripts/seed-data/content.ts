import { img, PHOTOS } from './photos';
import { d } from './pets';

export const PARTNERS = [
  { id: 'vetvida', name: 'VetVida Hospital 24h', category: 'Saúde e emergência', tagline: 'Pronto-socorro e especialistas para cães e gatos.', image: img(PHOTOS.clinicaVet, 600, 400), url: 'https://example.com/vetvida', benefit: '20% na 1ª consulta de pets adotados' },
  { id: 'banho-carinho', name: 'Banho & Carinho', category: 'Higiene e bem-estar', tagline: 'Banho terapêutico e tosa higiênica sem estresse.', image: img(PHOTOS.banhoGolden, 600, 400), url: 'https://example.com/banho', benefit: '1º banho grátis para resgatados' },
  { id: 'nutripet', name: 'NutriPet Rações', category: 'Alimentação', tagline: 'Nutrição balanceada indicada por veterinários.', image: img(PHOTOS.gatoLaranjaDeitado, 600, 400), url: 'https://example.com/nutripet', benefit: 'Kit boas-vindas na adoção' },
  { id: 'adestra-bem', name: 'Adestra Bem', category: 'Comportamento', tagline: 'Adestramento positivo para começar a vida juntos.', image: img(PHOTOS.caoNaGrama, 600, 400), url: 'https://example.com/adestra', benefit: 'Aula de adaptação gratuita' },
];

export const NEWS = [
  { id: 'novos-moradores', title: 'Novos moradores procurando um lar', date: d(-4), tag: 'Abrigo', excerpt: 'Três gatinhos resgatados de um telhado chegaram ao Refúgio Animal e já estão prontos para conhecer famílias.', body: 'Os irmãos foram resgatados durante uma chuva forte em Campinas. Depois de duas semanas de cuidados, vermifugação e a primeira dose de vacina, estão saudáveis e cheios de energia.\n\nEles podem ser adotados juntos ou separados, e a ONG faz o acompanhamento nos primeiros meses. Veja as fichas no catálogo e fale com a equipe.', image: img(PHOTOS.tresGatinhos, 1200, 800) },
  { id: 'feira-de-adocao', title: 'Feira de adoção "Rabo Feliz" no parque', date: d(-11), tag: 'Evento', excerpt: 'Mais de 40 cães e gatos esperam por você no próximo sábado, com atendimento veterinário gratuito.', body: 'A feira reúne as ONGs parceiras do PetLink em um só lugar. Traga documento com foto e comprovante de residência para agilizar a entrevista.\n\nHaverá também microchipagem gratuita para animais já adotados e uma tenda de orientação sobre adoção responsável.', image: img(PHOTOS.samoieda, 1200, 800) },
  { id: 'mutirao-castracao', title: 'Mutirão de castração gratuita', date: d(-20), tag: 'Saúde', excerpt: 'Em parceria com a VetVida, 200 castrações gratuitas para tutores de baixa renda em São Paulo.', body: 'A castração evita doenças e reduz o abandono. As vagas são distribuídas por ordem de inscrição e o animal precisa estar em jejum de 8 horas.\n\nInscrições pelo formulário de contato, informando bairro, espécie e idade do animal.', image: img(PHOTOS.clinicaVet, 1200, 800) },
];

export const STORIES = [
  { id: 'luna-viajante', petName: 'Luna', adopterName: 'Beatriz', title: 'Luna é uma viajante corajosa', quote: 'Ela chegou tímida, escondida debaixo da coberta. Hoje acompanha a gente até nas viagens de carro e dorme no meu travesseiro.', image: img(PHOTOS.gatoCobertor, 800, 600), date: d(-30) },
  { id: 'bento-familia', petName: 'Bento', adopterName: 'Lucas e Mariana', title: 'Bento ganhou uma família inteira', quote: 'Fomos só conhecer e voltamos com ele no colo. O questionário ajudou a gente a se preparar para tudo.', image: img(PHOTOS.casalComCao, 800, 600), date: d(-60) },
  { id: 'duque-praia', petName: 'Duque', adopterName: 'Rodrigo', title: 'Duque descobriu o mar', quote: 'Depois de dois anos no abrigo, o primeiro dia de praia dele foi a coisa mais linda que já vi.', image: img(PHOTOS.caoCorrendoPraia, 800, 600), date: d(-90) },
];
