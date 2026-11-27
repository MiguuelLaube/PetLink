// Falha se algum componente .tsx passar de 300 linhas (regra do ARCHITECTURE.md).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const LIMIT = 300;
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const big = walk('src')
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => [f, readFileSync(f, 'utf8').split('\n').length])
  .filter(([, n]) => n > LIMIT);
if (big.length) {
  console.error('Componentes acima de', LIMIT, 'linhas:\n' + big.map(([f, n]) => `  ${f}: ${n}`).join('\n'));
  process.exit(1);
}
console.log(`OK: nenhum .tsx acima de ${LIMIT} linhas.`);
