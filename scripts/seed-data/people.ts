/** Contas de teste — senhas válidas SÓ para o ambiente local (emulators). */
export const LOCAL_PASSWORD = 'PetLink@2026';

export const USERS = [
  { key: 'adotante', email: 'adotante@petlink.local', name: 'Ana Souza', phone: '(11) 98888-1234', role: 'user' },
  { key: 'carla', email: 'carla@petlink.local', name: 'Carla Mendes', phone: '(19) 97777-4321', role: 'user' },
  { key: 'admin', email: 'admin@petlink.local', name: 'Equipe PetLink', phone: '(11) 3000-0000', role: 'admin' },
  { key: 'ong', email: 'ong@petlink.local', name: 'Marina Costa', phone: '(11) 98765-4321', role: 'ong', ongId: 'amigos-de-patas' },
  { key: 'ong2', email: 'ong2@petlink.local', name: 'Rafael Lima', phone: '(19) 99887-6655', role: 'ong', ongId: 'refugio-animal' },
  { key: 'ong3', email: 'ong3@petlink.local', name: 'Júlia Ramos', phone: '(21) 97766-5544', role: 'ong', ongId: 'sos-focinhos' },
  { key: 'ong4', email: 'ong4@petlink.local', name: 'Pedro Alves', phone: '(41) 99654-3210', role: 'ong', ongId: 'lar-das-patinhas' },
] as const;
