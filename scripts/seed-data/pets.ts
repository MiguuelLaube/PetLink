import { img, PHOTOS } from './photos';

/** Data relativa a hoje (AAAA-MM-DD). Negativo = passado. */
export function d(days: number): string {
  const t = new Date();
  t.setDate(t.getDate() + days);
  return t.toISOString().slice(0, 10);
}

const dogVaccines = (lastV10: number, nextV10: number, nextRaiva: number) => [
  { nome: 'V10 (polivalente)', dataAplicada: d(lastV10), proximoReforco: d(nextV10) },
  { nome: 'Antirrábica', dataAplicada: d(lastV10 - 7), proximoReforco: d(nextRaiva) },
  { nome: 'Gripe canina', dataAplicada: d(lastV10 - 14), proximoReforco: d(nextV10 + 20) },
];

const catVaccines = (lastV4: number, nextV4: number, nextRaiva: number) => [
  { nome: 'V4 (quádrupla felina)', dataAplicada: d(lastV4), proximoReforco: d(nextV4) },
  { nome: 'Antirrábica', dataAplicada: d(lastV4 - 7), proximoReforco: d(nextRaiva) },
];

const deworm = (last: number, next: number) => [{ produto: 'Drontal Plus', data: d(last), proximo: d(next) }];

const hemograma = (days: number, resultado = 'Normal') => [{ nome: 'Hemograma completo', data: d(days), resultado }];

type Seed = Record<string, unknown> & { id: string; ongId: string; statusPublicacao: string; status: string };

const base = {
  breed: 'SRD',
  color: '',
  microchip: '',
  dataCastracao: '',
  specialNeeds: false,
  specialNeedsDetails: '',
  galleryImages: [] as string[],
};

export const PETS: Seed[] = [
  {
    ...base, id: 'tomas', ongId: 'amigos-de-patas', name: 'Tomás', species: 'Gato', age: '3 anos', ageGroup: 'Adulto', gender: 'Macho', size: 'Médio',
    color: 'Rajado cinza', city: 'São Paulo', state: 'SP', castrated: true, dataCastracao: d(-400), microchip: '985112003456781',
    description: 'Resgatado de um estacionamento, Tomás é calmo, adora janelas ensolaradas e ronrona alto quando recebe carinho na cabeça.',
    vacinas: catVaccines(-60, 305, 290), vermifugacoes: deworm(-30, 60), exames: [{ nome: 'FIV/FeLV', data: d(-90), resultado: 'Negativo' }],
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Baixa' }, mainImage: img(PHOTOS.gatoRajadoDeitado),
    status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-120),
  },
  {
    ...base, id: 'bela', ongId: 'amigos-de-patas', name: 'Bela', species: 'Cachorro', breed: 'Mestiça de Cavalier', age: '4 meses', ageGroup: 'Filhote', gender: 'Fêmea', size: 'Pequeno',
    color: 'Caramelo e branco', city: 'São Paulo', state: 'SP', castrated: false,
    description: 'Bela foi encontrada com os irmãos numa caixa de papelão. É curiosa, aprende rápido e já faz xixi no tapete higiênico.',
    vacinas: [{ nome: 'V10 (1ª dose)', dataAplicada: d(-20), proximoReforco: d(8) }], vermifugacoes: deworm(-20, 10), exames: [],
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Alta' }, mainImage: img(PHOTOS.cavalierFilhote),
    galleryImages: [img(PHOTOS.caoNaGrama)], status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-25),
  },
  {
    ...base, id: 'max', ongId: 'refugio-animal', name: 'Max', species: 'Cachorro', breed: 'SRD tipo Jack Russell', age: '2 anos', ageGroup: 'Adulto', gender: 'Macho', size: 'Médio',
    color: 'Tricolor', city: 'Campinas', state: 'SP', castrated: true, dataCastracao: d(-200),
    description: 'Max é puro entusiasmo: ama bolinha, corrida e brincadeira de esconde-esconde. Ideal para quem gosta de passear todos os dias.',
    vacinas: dogVaccines(-100, 265, 250), vermifugacoes: deworm(-45, 45), exames: hemograma(-100),
    comportamento: { criancas: 'Sim', outrosAnimais: 'Não testado', energia: 'Alta' }, mainImage: img(PHOTOS.jackRussell),
    status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-80),
  },
  {
    ...base, id: 'luna', ongId: 'refugio-animal', name: 'Luna', species: 'Gato', age: '5 meses', ageGroup: 'Filhote', gender: 'Fêmea', size: 'Pequeno',
    color: 'Rajada clara', city: 'Campinas', state: 'SP', castrated: false,
    description: 'Luna vive pedindo "toca aqui" com a patinha. É brincalhona, se dá bem com outros gatos e adora varinhas com pena.',
    vacinas: catVaccines(-15, 15, 340), vermifugacoes: deworm(-15, 15), exames: [],
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Alta' }, mainImage: img(PHOTOS.gatinhoPata),
    status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-40),
  },
  {
    ...base, id: 'caramelo', ongId: 'amigos-de-patas', name: 'Caramelo', species: 'Cachorro', breed: 'SRD tipo Beagle', age: '5 anos', ageGroup: 'Adulto', gender: 'Macho', size: 'Médio',
    color: 'Tricolor', city: 'São Paulo', state: 'SP', castrated: true, dataCastracao: d(-700), microchip: '985112003456799',
    description: 'O sorriso mais largo do abrigo. Caramelo é companheiro, obediente e já sabe sentar, deitar e dar a pata.',
    vacinas: dogVaccines(-200, 165, 150), vermifugacoes: deworm(-60, 30), exames: hemograma(-200),
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Média' }, mainImage: img(PHOTOS.beagleSorrindo),
    status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-300),
  },
  {
    ...base, id: 'mel', ongId: 'sos-focinhos', name: 'Mel', species: 'Cachorro', breed: 'SRD tipo Golden', age: '6 meses', ageGroup: 'Filhote', gender: 'Fêmea', size: 'Grande',
    color: 'Dourada', city: 'Rio de Janeiro', state: 'RJ', castrated: false,
    description: 'Mel ainda está crescendo e vai ser grande. É doce, adora gente e precisa de espaço e de alguém com tempo para educá-la.',
    vacinas: dogVaccines(-40, 25, 320), vermifugacoes: deworm(-40, 20), exames: [],
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Alta' }, mainImage: img(PHOTOS.goldenFilhote),
    status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-50),
  },
  {
    ...base, id: 'thor', ongId: 'sos-focinhos', name: 'Thor', species: 'Cachorro', breed: 'SRD tipo Golden', age: '9 anos', ageGroup: 'Idoso', gender: 'Macho', size: 'Grande',
    color: 'Dourado', city: 'Rio de Janeiro', state: 'RJ', castrated: true, dataCastracao: d(-1500),
    description: 'Thor foi devolvido quando a família se mudou. É tranquilo, dorminhoco e só quer um tapete macio e companhia.',
    vacinas: dogVaccines(-330, 35, 20), vermifugacoes: deworm(-80, 10), exames: hemograma(-60, 'Leve alteração renal, em acompanhamento'),
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Baixa' }, mainImage: img(PHOTOS.golden),
    status: 'Em Processo', statusPublicacao: 'publicado', entryDate: d(-500),
  },
  {
    ...base, id: 'pipoca', ongId: 'amigos-de-patas', name: 'Pipoca', species: 'Gato', age: '2 anos', ageGroup: 'Adulto', gender: 'Fêmea', size: 'Pequeno',
    color: 'Tricolor', city: 'São Paulo', state: 'SP', castrated: true, dataCastracao: d(-300),
    description: 'Pipoca é a observadora da casa: fica de longe no começo, mas depois não sai do seu colo. Prefere ambientes calmos.',
    vacinas: catVaccines(-90, 275, 260), vermifugacoes: deworm(-30, 60), exames: [{ nome: 'FIV/FeLV', data: d(-150), resultado: 'Negativo' }],
    comportamento: { criancas: 'Não testado', outrosAnimais: 'Não', energia: 'Média' }, mainImage: img(PHOTOS.gataTricolor),
    status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-150),
  },
  {
    ...base, id: 'simba', ongId: 'refugio-animal', name: 'Simba', species: 'Gato', age: '1 ano', ageGroup: 'Adulto', gender: 'Macho', size: 'Médio',
    color: 'Laranja', city: 'Campinas', state: 'SP', castrated: true, dataCastracao: d(-60),
    description: 'Simba é um gato laranja clássico: comilão, falante e carinhoso. Recebe todo mundo na porta.',
    vacinas: catVaccines(-120, 245, 230), vermifugacoes: deworm(-50, 40), exames: [],
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Média' }, mainImage: img(PHOTOS.gatoLaranjaAmarelo),
    status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-70),
  },
  {
    ...base, id: 'nina', ongId: 'sos-focinhos', name: 'Nina', species: 'Cachorro', breed: 'Pug', age: '3 anos', ageGroup: 'Adulto', gender: 'Fêmea', size: 'Pequeno',
    color: 'Preta', city: 'Rio de Janeiro', state: 'RJ', castrated: true, dataCastracao: d(-500), specialNeeds: true,
    specialNeedsDetails: 'Braquicefálica: evitar calor e exercícios intensos; passeios curtos nos horários frescos.',
    description: 'Nina ronca, bufa e conquista todo mundo. Veio de um canil de reprodução e merece uma vida tranquila de sofá.',
    vacinas: dogVaccines(-370, -5, 30), vermifugacoes: deworm(-100, -10), exames: hemograma(-30),
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Baixa' }, mainImage: img(PHOTOS.pugPreto),
    status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-210),
  },
  {
    ...base, id: 'bob', ongId: 'amigos-de-patas', name: 'Bob', species: 'Cachorro', age: '4 anos', ageGroup: 'Adulto', gender: 'Macho', size: 'Médio',
    color: 'Branco com manchas pretas', city: 'São Paulo', state: 'SP', castrated: true, dataCastracao: d(-600), specialNeeds: true,
    specialNeedsDetails: 'Surdo de nascença. Responde muito bem a sinais com as mãos e vibração no chão.',
    description: 'Bob não escuta, mas presta atenção em tudo. Aprendeu 8 sinais com os voluntários e é o mais carinhoso do abrigo.',
    vacinas: dogVaccines(-200, 165, -20), vermifugacoes: deworm(-60, 30), exames: [{ nome: 'BAER (audição)', data: d(-180), resultado: 'Surdez bilateral' }],
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Média' }, mainImage: img(PHOTOS.malhado),
    status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-260),
  },
  {
    ...base, id: 'frida', ongId: 'sos-focinhos', name: 'Frida', species: 'Gato', breed: 'Mestiça de Persa', age: '11 anos', ageGroup: 'Idoso', gender: 'Fêmea', size: 'Médio',
    color: 'Creme', city: 'Rio de Janeiro', state: 'RJ', castrated: true, dataCastracao: d(-3000), specialNeeds: true,
    specialNeedsDetails: 'Doença renal crônica estável: ração renal e exames a cada 6 meses.',
    description: 'Frida tem cara de brava e coração mole. Ficou sozinha quando a tutora faleceu e procura um lar silencioso para envelhecer.',
    vacinas: catVaccines(-353, 12, 100), vermifugacoes: deworm(-70, 20), exames: hemograma(-40, 'Creatinina elevada, estável'),
    comportamento: { criancas: 'Não', outrosAnimais: 'Não testado', energia: 'Baixa' }, mainImage: img(PHOTOS.gataPersa),
    status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-400),
  },
  {
    ...base, id: 'pacoca', ongId: 'refugio-animal', name: 'Paçoca', species: 'Cachorro', breed: 'SRD tipo Corgi', age: '7 meses', ageGroup: 'Filhote', gender: 'Macho', size: 'Pequeno',
    color: 'Caramelo e branco', city: 'Campinas', state: 'SP', castrated: false,
    description: 'Orelhas enormes, patas curtinhas e energia infinita. Paçoca adora brinquedos de morder e soneca depois do almoço.',
    vacinas: dogVaccines(-30, 335, 330), vermifugacoes: deworm(-30, 60), exames: [],
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Alta' }, mainImage: img(PHOTOS.corgiFilhote),
    status: 'Disponível', statusPublicacao: 'publicado', entryDate: d(-35),
  },
  {
    ...base, id: 'amora', ongId: 'amigos-de-patas', name: 'Amora', species: 'Gato', age: '4 anos', ageGroup: 'Adulto', gender: 'Fêmea', size: 'Pequeno',
    color: 'Rajada escura', city: 'São Paulo', state: 'SP', castrated: true, dataCastracao: d(-800),
    description: 'Amora é independente e elegante. Gosta de carinho na hora dela e é ótima para quem trabalha fora.',
    vacinas: catVaccines(-180, 185, 170), vermifugacoes: deworm(-90, 0), exames: [],
    comportamento: { criancas: 'Não testado', outrosAnimais: 'Sim', energia: 'Baixa' }, mainImage: img(PHOTOS.gatoRajadoEscuro),
    status: 'Adotado', statusPublicacao: 'publicado', entryDate: d(-420),
  },
  {
    ...base, id: 'zeca', ongId: 'sos-focinhos', name: 'Zeca', species: 'Cachorro', breed: 'SRD tipo Samoieda', age: '6 anos', ageGroup: 'Adulto', gender: 'Macho', size: 'Grande',
    color: 'Branco', city: 'Rio de Janeiro', state: 'RJ', castrated: true, dataCastracao: d(-900),
    description: 'Zeca é um nuvem de pelo branco. Cadastro novo, ainda em revisão pela equipe PetLink.',
    vacinas: dogVaccines(-10, 355, 350), vermifugacoes: deworm(-10, 80), exames: [],
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Média' }, mainImage: img(PHOTOS.samoieda),
    status: 'Disponível', statusPublicacao: 'em_analise', entryDate: d(-5),
  },
  {
    ...base, id: 'chico', ongId: 'amigos-de-patas', name: 'Chico', species: 'Gato', age: '3 anos', ageGroup: 'Adulto', gender: 'Macho', size: 'Médio',
    color: 'Rajado', city: 'São Paulo', state: 'SP', castrated: true, dataCastracao: d(-100),
    description: 'Chico chegou semana passada e já explorou cada degrau do abrigo. Cadastro aguardando aprovação.',
    vacinas: catVaccines(-7, 358, 350), vermifugacoes: deworm(-7, 83), exames: [],
    comportamento: { criancas: 'Sim', outrosAnimais: 'Sim', energia: 'Média' }, mainImage: img(PHOTOS.gatoEscada),
    status: 'Disponível', statusPublicacao: 'em_analise', entryDate: d(-3),
  },
];
