import { img, PHOTOS } from './photos';

/** Gera um CNPJ válido a partir de 12 dígitos-base. */
function cnpj(base12: string): string {
  const calc = (b: string) => {
    const w = b.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const r = b.split('').reduce((a, d, i) => a + Number(d) * w[i], 0) % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = calc(base12);
  const full = base12 + d1 + calc(base12 + d1);
  return full.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export const ONGS = [
  {
    id: 'amigos-de-patas',
    owner: 'ong',
    name: 'Amigos de Patas',
    cnpj: cnpj('123456780001'),
    email: 'ong@petlink.local',
    phone: '(11) 98765-4321',
    address: 'Av. Paulista, 1200 - Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    description:
      'Desde 2014 resgatamos cães e gatos das ruas do centro de São Paulo. Cada animal passa por veterinário, castração e socialização antes de ir para um novo lar.',
    logoUrl: img(PHOTOS.corgiEYorkie, 400, 400),
    status: 'aprovada',
    featured: true,
  },
  {
    id: 'refugio-animal',
    owner: 'ong2',
    name: 'Refúgio Animal',
    cnpj: cnpj('987654320001'),
    email: 'ong2@petlink.local',
    phone: '(19) 99887-6655',
    address: 'Rua das Flores, 450 - Taquaral',
    city: 'Campinas',
    state: 'SP',
    description:
      'Abrigo com equipe veterinária própria, focado em filhotes resgatados e gatos. Fazemos feiras de adoção todo segundo sábado do mês.',
    logoUrl: img(PHOTOS.tresGatinhos, 400, 400),
    status: 'aprovada',
    featured: true,
  },
  {
    id: 'sos-focinhos',
    owner: 'ong3',
    name: 'SOS Focinhos',
    cnpj: cnpj('456789010001'),
    email: 'ong3@petlink.local',
    phone: '(21) 97766-5544',
    address: 'Rua Barata Ribeiro, 300 - Copacabana',
    city: 'Rio de Janeiro',
    state: 'RJ',
    description:
      'Resgate urbano e reabilitação de animais idosos e com necessidades especiais. Acreditamos que todo focinho merece uma segunda chance.',
    logoUrl: img(PHOTOS.caoNaGrama, 400, 400),
    status: 'aprovada',
    featured: false,
  },
  {
    id: 'lar-das-patinhas',
    owner: 'ong4',
    name: 'Lar das Patinhas',
    cnpj: cnpj('789012340001'),
    email: 'ong4@petlink.local',
    phone: '(41) 99654-3210',
    address: 'Rua XV de Novembro, 900 - Centro',
    city: 'Curitiba',
    state: 'PR',
    description:
      'Rede de lares temporários em Curitiba e região metropolitana. Aguardando validação do cadastro pela equipe PetLink.',
    logoUrl: img(PHOTOS.gatinhoPata, 400, 400),
    status: 'pendente',
    featured: false,
  },
] as const;
