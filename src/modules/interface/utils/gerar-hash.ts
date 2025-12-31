// gerar-hash.ts
import bcrypt from 'bcrypt';

async function gerarHash(senha: string) {
  const hash = await bcrypt.hash(senha, 10);
  console.log(`Senha original: ${senha}`);
  console.log(`Hash gerado: ${hash}`);
}

gerarHash('123'); // você pode mudar a senha aqui
