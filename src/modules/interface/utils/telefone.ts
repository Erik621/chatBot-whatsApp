export function gerarPossiveisTelefones(
  telefoneInput: string,
  dddPadrao = '77'
): string[] {
  const numero = telefoneInput.replace(/\D/g, '');

  const possibilidades = new Set<string>();

  // Caso 1: número local (8 ou 9 dígitos)
  if (numero.length === 8 || numero.length === 9) {
    possibilidades.add(`${dddPadrao}${numero}`);
    possibilidades.add(`${dddPadrao}9${numero}`);
    possibilidades.add(`${dddPadrao}${numero.replace(/^9/, '')}`);
  }

  // Caso 2: com DDD (10 ou 11 dígitos)
  if (numero.length === 10 || numero.length === 11) {
    const ddd = numero.slice(0, 2);
    const local = numero.slice(2);

    possibilidades.add(`${ddd}${local}`);
    possibilidades.add(`${ddd}9${local}`);
    possibilidades.add(`${ddd}${local.replace(/^9/, '')}`);
  }

  // Remove duplicados e números curtos demais
  return [...possibilidades].filter(n => n.length >= 10 && n.length <= 11);
}
