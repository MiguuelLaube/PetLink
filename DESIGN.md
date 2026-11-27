# DESIGN.md — PetLink

A direção visual vem da **imagem de referência** enviada pelo usuário: um site de adoção quente, divertido e "de abrigo". Ela **não** foi comparada com outros sites. O logo rosé do PetLink entra na navbar, no rodapé e no splash; todo o resto segue esta paleta.

Regra de ouro: no código só entram **nomes de token** (`bg-peach`, `text-primary`). Nenhuma cor em hex solta fora de `src/styles/tokens.css`.

---

## 1. Cor

| Token | Valor | Papel |
|---|---|---|
| `bg` | `#FFF6E9` | fundo da página (creme) |
| `peach` | `#F9D9C9` | blocos de seção alternados e card de ajuda R$ 25 |
| `peach-soft` | `#FCE8DD` | cards dentro de blocos pêssego e hovers |
| `yellow` | `#F6B73C` | barra do hero, card R$ 10 e balões de destaque |
| `orange` | `#F08A24` | selos inclinados, pontos de destaque e o estado "vence em breve" |
| `blue` | `#BFE3E6` | card R$ 50 e cards de pet alternados |
| `primary` | `#5A0F12` | títulos, botões primários, rodapé e links (vinho) |
| `primary-hover` | `#741A1E` | hover do primário |
| `text` | `#3B2A26` | texto corrido |
| `text-muted` | `#7A5E55` | legendas e metadados (5,4:1 sobre `bg`) |
| `cream` | `#FFF6E9` | texto sobre vinho |
| `line` | `#EBD6C8` | bordas e divisórias |
| `success` | `#2F7A4B` | status "em dia" e "aprovado" |
| `warning` | `#B4570A` | status "vence em breve" (texto) |
| `danger` | `#B3261E` | status "atrasada", "recusado" e erros |

**Contraste (AA):**
- O texto sobre `yellow`, `orange`, `peach` e `blue` é sempre `primary` ou `text`, nunca branco. Vinho sobre laranja dá 6,7:1 e sobre amarelo, 8,9:1.
- O texto creme só aparece sobre `primary` (13:1).
- Os badges de status usam um fundo claro com texto escuro da mesma família (por exemplo, `success` sobre `#E3F2E8`).

Não há modo escuro: a marca é creme. O `color-scheme` fica `light`.

## 2. Tipografia

| Família | Uso | Pesos |
|---|---|---|
| **Anton** | títulos de seção, hero, valores R$ | 400 (já é bold) |
| **Poppins** | texto, botões, formulários | 400 / 500 / 600 |
| **Dancing Script** | frases decorativas ao lado dos títulos, `opacity: .72` (mínimo para 4,5:1 sobre creme e pêssego), `aria-hidden` | 500 |

| Escala | Tamanho | Entrelinha | Uso |
|---|---|---|---|
| `display` | `clamp(3.5rem, 11vw, 9rem)` | 0.88 | hero "Pet / Link" |
| `h1` | `clamp(2.5rem, 6vw, 4.5rem)` | 0.9 | títulos de seção |
| `h2` | `clamp(1.75rem, 3.5vw, 2.5rem)` | 0.95 | títulos de página interna e painéis |
| `h3` | `1.25rem` (Poppins 600) | 1.3 | títulos de card |
| `body` | `1rem` | 1.6 | texto |
| `small` | `0.875rem` | 1.5 | metadados |
| `xs` | `0.75rem` (600, maiúsculas) | 1.2 | selos e badges |

Os títulos em Anton ficam em maiúsculas/minúsculas como na referência ("Seus Amigos Esperam Por Você"), com cor `primary` e `letter-spacing: -0.01em`. O texto corrido tem no máximo `65ch`.

## 3. Espaçamento e layout
- Escala de 4px (a padrão do Tailwind).
- Seções: `py-16` no celular e `py-24` no desktop. Blocos internos com `p-6 md:p-12`.
- Largura do conteúdo: `max-w-6xl` (1152px) com respiro lateral de `px-4` (16px).
- Breakpoints: 640 / 768 / 1024 / 1280.
- As seções alternam fundo: o creme vai direto na página, e o pêssego vem em um **bloco arredondado** dentro da largura do conteúdo, como na referência.

## 4. Forma e profundidade
| Token | Valor | Uso |
|---|---|---|
| `radius-block` | `32px` | blocos de seção, banner |
| `radius-card` | `16px` | cards de pet, ajuda, notícia |
| `radius-pill` | `999px` | botões, selos, badges |
| `shadow-warm` | `0 10px 30px -12px rgb(90 15 18 / .25)` | cards e card flutuante do hero |
| `shadow-soft` | `0 4px 14px -6px rgb(90 15 18 / .18)` | botões, inputs em foco |

## 5. Assinaturas visuais
- **Selo (`Stamp`):** pílula laranja com texto vinho em `xs`, `rotate(-6deg)`, posicionada sobre o canto do título. Textos: "SALVE UMA VIDA", "AJUDE-OS", "SEU NOVO AMIGO".
- **Moldura de casinha (`HouseFrame`):** a foto recebe `clip-path: polygon(50% 0, 100% 28%, 100% 100%, 0 100%, 0 28%)` sobre um fundo de cor (amarelo, pêssego ou azul).
- **Fundo (`PawBackground`):** pegadas e nuvens em SVG inline, com `opacity` entre .06 e .12, `aria-hidden` e `pointer-events: none`.
- **Frase cursiva:** uma frase curta em Dancing Script ao lado do título, decorativa (opacidade .72 por contraste).

## 6. Componentes
**Botões** (pílula, Poppins 600, `min-height: 44px`):
- `primary`: fundo vinho, texto creme e a seta dentro de um círculo creme à direita. No hover, `primary-hover` e a seta anda 2px.
- `secondary`: contorno vinho de 1,5px, texto vinho e fundo transparente. No hover, fundo `peach-soft`.
- `ghost`: só texto vinho sublinhado no hover.
- `disabled`: `opacity .5` e `cursor-not-allowed`. Em `loading`, um spinner substitui a seta e o botão ganha `aria-busy`.
- `focus-visible`: `outline` de 3px em `orange` com `offset` de 2px, igual em todos os elementos interativos.

**Inputs:** fundo branco, borda `line`, `radius 12px` e altura 44px. Em foco, borda `primary` mais `shadow-soft`. O erro aparece em `danger` abaixo do campo, ligado por `aria-describedby`.

**Card de pet:** fundo `peach-soft`, `yellow`/40 ou `blue`, alternando. A foto fica no `HouseFrame` e embaixo vêm o nome (h3), a idade (`small`, à direita), a descrição em 2 linhas, o botão "Adotar" (`secondary`, pequeno) e o coração de favorito (`aria-pressed`).

**Card de ajuda:** fundo de cor sólida, o valor em Anton 3rem, o texto do que o valor paga, a foto do animal saindo pela borda inferior e o botão "Doar agora".

**Badge:** pílula `xs`. Variantes `success`, `warning`, `danger`, `neutral` e `info` (azul).

**Modal:** fundo `bg`, `radius-block`, focus trap, fecha com Esc, `aria-modal` e título ligado por `aria-labelledby`.

**Navbar:** fundo creme. Logo à esquerda, links centrais em pílula (o link ativo fica com fundo vinho e texto creme) e "Entrar" ou a conta à direita. No celular, menu hambúrguer em painel.

**Rodapé:** fundo vinho e texto creme. Logo (versão clara), colunas de links, redes sociais em círculos e a faixa "Adoção é um compromisso para a vida toda".

**Estados:** `Skeleton` (pulso `peach-soft`), `EmptyState` (ilustração de pegada, título e ação) e erro (mensagem e "Tentar de novo"). Feedback por toast (sonner) com `aria-live`.

## 7. Imagens e ícones
- Ícones: **lucide-react**, traço 2 e tamanho 18–20. Nada de emoji como ícone.
- Fotos: animais reais, luz quente, em WebP com `loading="lazy"` (exceto o hero) e `alt` descritivo ("Gata cinza de olhos amarelos olhando para a câmera").
- Logo: `public/brand/logo.webp` (fundo transparente) e `logo-mark.webp` (só o traço).

## 8. Movimento
- Entrada das seções: fade com `y: 24 → 0`, 0,5s `easeOut`, uma vez.
- Hover em cards: `translateY(-4px)` e sombra maior.
- Com `prefers-reduced-motion: reduce`: sem deslocamento, só opacidade, e o splash vira logo estático.
