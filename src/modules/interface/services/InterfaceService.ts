// src/modules/users/services/UserService.ts
import { UserRepository, CategoriaRepository, ProdutoRepository } from '../repositories/InterfaceRepository';
import { CreateUserDTO } from '../dtos/CreateInterfaceDTO';
import { User } from '../../../../db/entities/interface/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Categoria } from '../../../../db/entities/interface/Categoria';
import { Produto } from '../../../../db/entities/interface/Produto';

export class UserService {

  async login(data: CreateUserDTO): Promise<{ token: string }> {
    console.log("Email recebido:", data.email);
    console.log("Senha recebida:", data.password);

    const user = await UserRepository.findOneBy({ email: data.email });
    if (!user) throw new Error('Credenciais inválidas');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error('Credenciais inválidas');

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: '1d',
    });


    return { token, };
  }

}

export class CategoriaService {
  async listarCategorias(): Promise<Categoria[]> {
    return CategoriaRepository.find({ relations: ["produtos"] });
  }

  async criarCategoria(nome: string): Promise<Categoria> {
    const categoria = CategoriaRepository.create({ nome, ativa: true });
    return CategoriaRepository.save(categoria);
  }

  async editarCategoria(id: number, nome: string, ativa: boolean): Promise<Categoria> {
    const categoria = await CategoriaRepository.findOneByOrFail({ id });
    categoria.nome = nome;
    categoria.ativa = ativa;
    return CategoriaRepository.save(categoria);
  }

  async excluirCategoria(id: number): Promise<void> {
    await CategoriaRepository.delete(id);
  }

  async criarProduto(categoriaId: number, data: Produto): Promise<Produto> {
    const categoria = await CategoriaRepository.findOneByOrFail({ id: categoriaId });
    const novoProduto = ProdutoRepository.create({ ...data, categoria });
    return ProdutoRepository.save(novoProduto);
  }

  async editarProduto(categoriaId: number, produtoId: number, data: Produto): Promise<Produto> {
    const produto = await ProdutoRepository.findOneOrFail({ where: { id: produtoId }, relations: ["categoria"] });
    produto.nome = data.nome;
    produto.descricao = data.descricao;
    produto.imagem = data.imagem;
    produto.valor = data.valor;
    return ProdutoRepository.save(produto);
  }

  async excluirProduto(produtoId: number): Promise<void> {
    await ProdutoRepository.delete(produtoId);
  }
}
