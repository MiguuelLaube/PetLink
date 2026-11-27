export const brl = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: value % 1 === 0 ? 0 : 2 });

export function whatsappLink(phone: string, text: string): string {
  return `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}
