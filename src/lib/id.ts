/** Id curto e legível para documentos (ex.: "luna-k3f9x2"). */
export function slugId(base: string): string {
  const slug = base
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 30);
  const rand = Math.random().toString(36).slice(2, 8);
  return slug ? `${slug}-${rand}` : rand;
}
