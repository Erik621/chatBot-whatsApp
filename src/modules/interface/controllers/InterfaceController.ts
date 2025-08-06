// src/modules/users/controllers/UserController.ts
import { Request, Response } from 'express';
import { UserService, CategoriaService } from '../services/InterfaceService';
import path from 'path';
import fs from 'fs';

const userService = new UserService();
const service = new CategoriaService();

export class UserController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const result = await userService.login(req.body);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }

  // UPLOAD DE IMAGEM - se preferir aqui
  async uploadImagem(req: Request & { file: Express.Multer.File }, res: Response) {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const caminhoRelativo = `/imagens/${req.file.filename}`;
    return res.status(200).json({ caminho: caminhoRelativo });
  }
}

export class CategoriaController {
  // ========= CATEGORIAS =========
  async listar(req: Request, res: Response) {
    const categorias = await service.listarCategorias();
    return res.json(categorias);
  }

  async criarCategoria(req: Request, res: Response) {
    const { nome } = req.body;
    const categoria = await service.criarCategoria(nome);
    return res.status(201).json(categoria);
  }

  async editarCategoria(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { nome, ativa } = req.body;
    const categoria = await service.editarCategoria(id, nome, ativa);
    return res.json(categoria);
  }

  async excluirCategoria(req: Request, res: Response) {
    const id = Number(req.params.id);
    await service.excluirCategoria(id);
    return res.status(204).send();
  }

  // ========= PRODUTOS =========
  async listarProduto(req: Request, res: Response) {
    const produtos = await service.listarProdutos();
    return res.json(produtos);
  }

  async criarProduto(req: Request, res: Response) {
    const categoriaId = Number(req.params.id);
    const produto = await service.criarProduto(categoriaId, req.body);
    return res.status(201).json(produto);
  }

  async editarProduto(req: Request, res: Response) {
    const categoriaId = Number(req.params.id);
    const produtoId = Number(req.params.produtoId);
    const produto = await service.editarProduto(categoriaId, produtoId, req.body);
    return res.json(produto);
  }

  async excluirProduto(req: Request, res: Response) {
    const produtoId = Number(req.params.produtoId);
    await service.excluirProduto(produtoId);
    return res.status(204).send();
  }

  // ========= INGREDIENTES =========
  async criarItem(req: Request, res: Response) {
    const produtoId = Number(req.params.produtoId);
    const item = await service.criarIngrediente(produtoId, req.body);
    return res.status(201).json(item);
  }

  async listarItens(req: Request, res: Response) {
    const produtoId = Number(req.params.produtoId);
    const itens = await service.listarIngredientesPorProduto(produtoId);
    return res.json(itens);
  }

  async editarItem(req: Request, res: Response) {
    const itemId = Number(req.params.itemId);
    const item = await service.editarIngrediente(itemId, req.body);
    return res.json(item);
  }

  async excluirItem(req: Request, res: Response) {
    const itemId = Number(req.params.itemId);
    await service.excluirIngrediente(itemId);
    return res.status(204).send();
  }
}
