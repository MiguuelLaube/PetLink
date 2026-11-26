# ARCHITECTURE.md — PetLink

## Visão geral
O PetLink é uma SPA em React 19, TypeScript e Vite que fala direto com o **Firebase** (Auth, Firestore e Storage). Não há servidor próprio. A segurança fica nas **Security Rules** (`firestore.rules` e `storage.rules`), que fazem o papel das RLS. O deploy do front é na Vercel.

```
Navegador ──► React Router (rotas lazy)
                 │
                 ├─ components/ (só UI, sem Firebase)
                 ├─ features/<domínio>/ (páginas + hooks TanStack Query)
                 │        │
                 │        ▼
                 └─ services/ ──► Firebase SDK ──► Auth / Firestore / Storage
                                                     ▲
                                        Security Rules (por perfil)
```

## Perfis
| Perfil | `users/{uid}.role` | Como nasce |
|---|---|---|
| Adotante | `user` | cadastro em `/cadastro` |
| ONG | `ong` | cadastro em `/cadastro-ong`: cria `users` com `role: 'ong'` e `ongs/{id}` com `status: 'pendente'`. Só depois que o admin aprova é que os pets da ONG podem ser publicados. |
| Admin | `admin` | criado pelo seed ou promovido manualmente no console. Nenhuma regra deixa o usuário se tornar admin. |

Na criação, o adotante só pode gravar `role: 'user'`. A ONG só pode gravar `role: 'ong'` junto com uma ONG `pendente` cujo `ownerUid` seja ela mesma.

## Rotas
| Rota | Página | Guard |
|---|---|---|
| `/` | Home | — |
| `/adocao`, `/adocao/:id` | Catálogo e ficha | — |
| `/ongs`, `/ongs/:id` | Diretório e perfil | — |
| `/lar-temporario` | Relato de resgate | o envio exige login |
| `/doar` | Doação simulada | — |
| `/sobre`, `/contato`, `/faq`, `/noticias/:id` | Institucionais | — |
| `/entrar`, `/cadastro`, `/cadastro-ong` | Autenticação | só deslogado |
| `/minha-conta` | Portal do adotante | `user` |
| `/ong/painel` | Painel da ONG | `ong` |
| `/admin` | Painel administrativo | `admin` |
| `*` | 404 | — |

As abas internas dos painéis ficam na URL (`?aba=candidatos`), então qualquer tela pode ser compartilhada.

## Pastas
```
src/
  app/          router, providers (QueryClient, Auth, Toaster), RootLayout, RequireRole
  components/   ui/, sections/, pets/, forms/, layout/   (sem Firebase)
  features/     adocao, ongs, foster, auth, conta, ong-painel, admin, doacao, institucional
  services/     firebase.ts + um arquivo por coleção (pets, ongs, solicitations, foster, users, content, storage)
  lib/          funções puras: vaccineStatus, cnpj, dates, format, seo, filters
  schemas/      zod: fonte única dos tipos (z.infer) e validação dos formulários
  styles/       tokens.css (@theme) e base.css
```
Regras:
1. Um componente nunca importa de `firebase/*` nem de `services/`; ele usa os hooks de `features/*/hooks`.
2. Nenhum arquivo `.tsx` passa de cerca de 300 linhas, o que `npm run check:size` verifica.
3. Escritas que tocam mais de um documento usam `writeBatch`, para tudo acontecer junto ou nada acontecer.

## Modelo de dados (Firestore)
| Caminho | Quem lê | Quem escreve |
|---|---|---|
| `users/{uid}` | o próprio usuário e o admin | o próprio usuário (sem mudar `role` nem `active`) e o admin |
| `users/{uid}/favorites/{petId}` | o próprio usuário | o próprio usuário |
| `ongs/{id}` | todos, se `aprovada`; o dono e o admin, sempre | o dono (sem mudar `status`) e o admin |
| `pets/{id}` | todos, se `publicado`; a ONG dona e o admin, sempre | a ONG dona (sempre grava `em_analise`) e o admin |
| `pets/{id}/history/{h}` | quem pode ler o pet | a ONG dona, o admin e o adotante (só uma entrada `solicitacao_adocao`) |
| `solicitations/{id}` | o adotante dono, a ONG do pet e o admin | o adotante cria (`pending`) e cancela; a ONG muda o status |
| `fosterRequests/{id}` | quem relatou, as ONGs (pendentes ou aceitas por ela) e o admin | o usuário cria; a ONG aceita, recusa ou promove |
| `notifications/{id}` | o destinatário | a ONG e o admin criam; o destinatário marca como lida |
| `partners`, `news`, `stories` | todos | o admin |
| `donations`, `sponsorLeads` | o admin | qualquer pessoa cria |

**Mudanças de status de um pet** (`status`): `Disponível → Em Processo` (pedido aprovado) `→ Adotado` (adoção concluída). Se o pedido for cancelado ou recusado depois da aprovação, o pet volta a `Disponível`.

**Publicação** (`statusPublicacao`): `em_analise → publicado | recusado`. Só o admin muda. Qualquer edição da ONG volta para `em_analise`.

**Solicitação:** `pending → in_review → approved | rejected → completed | canceled`.

## Fluxo de dados
- **TanStack Query** guarda o cache das leituras, com chaves por domínio (`['pets', 'publicados']`, `['pet', id]`, `['ong', ongId, 'solicitations']`). As mutations invalidam as chaves afetadas.
- **Catálogo:** uma query busca os pets `publicado`, e os filtros, a ordenação e a busca rodam no cliente (`lib/filters.ts`), a partir da query string. Isso atende algumas centenas de pets; se crescer, o caminho é indexar em Algolia ou Typesense.
- **Favoritos:** quando logado, ficam em `users/{uid}/favorites`; sem login, no `localStorage`. No login, os favoritos locais são copiados para a conta.
- **Status de vacina:** `lib/vaccineStatus.ts` calcula, a partir de `proximoReforco` e da data de hoje, se está em dia, vence em até 30 dias ou está atrasada. A função tem testes unitários.

## Ambiente
- `.env` com `VITE_FIREBASE_*` (veja `.env.example`). Com `VITE_USE_EMULATORS=true`, o app conecta nos emulators locais.
- `firebase.json` define as portas dos emulators: Auth 9099, Firestore 8080, Storage 9199 e UI 4000.
- `scripts/seed.ts` usa o `firebase-admin` apontado para os emulators.
