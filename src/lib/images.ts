/** Fotos fixas da home (Unsplash, licença livre) em WebP. */
const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75&fm=webp`;

export const IMAGES = {
  heroCat: { src: u('1514888286974-6c03e2ca1dba', 900, 1000), alt: 'Gato preto e branco apoiando as patas e olhando curioso para a câmera' },
  mission: { src: u('1450778869180-41d0601e046e', 900, 900), alt: 'Um cachorro e um gato abraçados, dormindo juntos' },
  waiting: { src: u('1588943211346-0908a1fb0b01', 400, 300), alt: 'Cachorrinho deitado de barriga para cima na grama, feliz' },
  help10: { src: u('1596854407944-bf87f6fdd49e', 400, 400), alt: 'Gato laranja em pé sobre fundo amarelo' },
  help25: { src: u('1537151608828-ea2b11777ee8', 400, 400), alt: 'Filhote de orelhas grandes olhando para a câmera' },
  help50: { src: u('1574158622682-e40e69881006', 400, 400), alt: 'Gato rajado olhando para cima sobre fundo azul' },
  banner: { src: u('1548199973-03cce0bbc87b', 1600, 700), alt: 'Dois cachorrinhos correndo lado a lado ao pôr do sol' },
  involved: { src: u('1592194996308-7b43878e84a6', 700, 800), alt: 'Gatinho levantando a patinha como se acenasse' },
  finalCta: { src: u('1570018144715-43110363d70a', 800, 600), alt: 'Três gatinhos rajados lado a lado' },
  about: { src: u('1601758124510-52d02ddb7cbd', 1000, 700), alt: 'Casal sorrindo com o cachorro adotado no colo' },
} as const;
