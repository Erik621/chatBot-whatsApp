export function gerarPossiveisTelefones(
  telefoneInput: string
): string[] {
  const numero = telefoneInput.replace(/\D/g, '');
  const possibilidades = new Set<string>();

  // Já tem DDD
  if (numero.length === 10 || numero.length === 11) {
    const ddd = numero.slice(0, 2);
    const local = numero.slice(2);

    possibilidades.add(`55${ddd}${local}`);
    possibilidades.add(`55${ddd}9${local.replace(/^9/, '')}`);
  }

  // Sem DDD → NÃO inventa
  // Apenas retorna vazio para não gerar número errado
  return [...possibilidades].map(n => `${n}@c.us`);
}
