# PetLink · Conexão e amor animal

Plataforma pt-BR que conecta **ONGs**, **adotantes** e **administradores** para adoção responsável, lar temporário e doações.

- **Front:** React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7, TanStack Query, react-hook-form, zod, motion, lucide-react.
- **Back:** Firebase (Auth, Firestore, Storage). A segurança fica nas Security Rules (`firestore.rules` e `storage.rules`).
- **Documentação:** [`DESIGN.md`](DESIGN.md) (tokens e componentes) e [`ARCHITECTURE.md`](ARCHITECTURE.md) (rotas, dados, perfis e regras).

---

## Rodar localmente (sem projeto Firebase real)

Pré-requisitos: Node 20+ e Java 11+ (os emulators do Firebase usam Java).

```bash
npm install
cp .env.example .env          # já vem com VITE_USE_EMULATORS=true
```

Em um terminal, suba os emulators (Auth, Firestore e Storage):

```bash
npm run emulators
```

Em outro terminal, popule os dados de demonstração e suba o site:

```bash
npm run seed
npm run dev
```

O site abre em http://localhost:5173 e a interface dos emulators em http://localhost:4000.

> O `npm run seed` **apaga e recria** todos os dados dos emulators. Ele recusa rodar fora de um projeto `demo-*`.

### Usuários de teste (somente local)

Todos usam a senha `PetLink@2026`, válida só nos emulators.

| Perfil | E-mail | O que dá para testar |
|---|---|---|
| Adotante | `adotante@petlink.local` | favoritos, questionário, "Minhas adoções" (já tem um pedido aprovado do Thor) |
| Adotante 2 | `carla@petlink.local` | pedido pendente do Tomás e um relato de resgate |
| ONG | `ong@petlink.local` | painel da **Amigos de Patas**: pets, candidatos, lar temporário e perfil |
| ONGs 2–4 | `ong2@…`, `ong3@…`, `ong4@petlink.local` | a `ong4` é a **Lar das Patinhas**, ainda pendente de aprovação |
| Admin | `admin@petlink.local` | aprovação de ONGs e pets, métricas, usuários, conteúdo e mensagens |

O seed cria 16 animais (2 em análise, 1 adotado, 1 em processo; alguns com vacina atrasada ou vencendo e com necessidades especiais), 4 ONGs, 4 parceiros, 3 notícias e 3 histórias. As datas de vacina são calculadas a partir do dia em que o seed roda.

> As histórias, notícias e parceiros do seed são **dados de demonstração**. Troque-os por conteúdo real (com autorização das famílias) pelo painel do admin antes de publicar.

---

## Testes e verificações

| Comando | O que faz |
|---|---|
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | testes unitários (status de vacina, CNPJ, filtros do catálogo) |
| `npm run test:rules` | testa as Security Rules com visitante, adotante, ONG e admin (precisa dos emulators rodando) |
| `npm run e2e` | Playwright: fluxo completo de adoção, publicação pelo admin, lar temporário → pet, filtros na URL (precisa de emulators e de `npm run seed` antes) |
| `npm run check:size` | falha se algum `.tsx` passar de 300 linhas |
| `npm run check:graph` | `madge` (dependência circular) e `knip` (código morto) |
| `npm run build` | typecheck e build de produção em `dist/` |

---

## Publicar

### 1. Criar o projeto no Firebase

1. Crie um projeto em https://console.firebase.google.com.
2. Ative **Authentication › E-mail/senha**, o **Firestore** (modo produção) e o **Storage**.
3. Em *Configurações do projeto › Seus apps*, registre um app Web e copie a configuração.
4. Publique as regras e índices:

```bash
npx firebase login
```

```bash
npx firebase deploy --only firestore:rules,firestore:indexes,storage --project SEU_PROJECT_ID
```

5. Crie o primeiro admin: cadastre-se pelo site como adotante e, no console do Firestore, mude `users/{seu uid}.role` para `admin`. Nenhuma regra permite que alguém vire admin pelo app.

### 2. Deploy do front na Vercel

1. Importe o repositório na Vercel (framework **Vite**; build `npm run build`; saída `dist`).
2. Em *Environment Variables*, preencha `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_APP_ID` e deixe `VITE_USE_EMULATORS=false`.
3. Adicione o domínio da Vercel em *Authentication › Settings › Authorized domains* no Firebase.

O `vercel.json` já traz o rewrite de SPA e cabeçalhos de segurança.

### Pagamentos

A doação é **simulada**: ela só grava um registro em `donations` com `status: "simulado"`. O ponto de integração com Pix, Mercado Pago ou Stripe está marcado com `// TODO PAGAMENTO:` em `src/services/content.ts`.

---

## Estrutura

```
src/
  app/         router e providers
  components/  ui/, sections/, pets/, forms/, layout/  (só UI)
  features/    páginas e hooks por domínio (adocao, ongs, foster, auth, conta, ong-painel, admin, doacao, institucional)
  services/    único ponto de acesso ao Firebase
  lib/         funções puras (vacinas, CNPJ, filtros, datas, SEO)
  schemas/     zod: tipos e validação
  styles/      tokens.css (@theme) e base.css
scripts/       seed e verificações
tests/         unitários e regras
e2e/           Playwright
```
