// src/modules/users/routes.ts
import { Router } from 'express';
import { UserController, CategoriaController } from './controllers/InterfaceController';

const router = Router();
const userController = new UserController();
const categoriaController = new CategoriaController();

// Login
router.post('/login', async (req, res) => {
  await userController.login(req, res);
});

// Categorias
router.get("/categorias", async (req, res) => {
  await categoriaController.listar(req, res);
});

router.post("/categorias", async (req, res) => {
  await categoriaController.criarCategoria(req, res);
});

router.put("/categorias/:id", async (req, res) => {
  await categoriaController.editarCategoria(req, res);
});

router.delete("/categorias/:id", async (req, res) => {
  await categoriaController.excluirCategoria(req, res);
});

// Produtos
router.post("/categorias/:id/produtos", async (req, res) => {
  await categoriaController.criarProduto(req, res);
});

router.put("/categorias/:id/produtos/:produtoId", async (req, res) => {
  await categoriaController.editarProduto(req, res);
});

router.delete("/categorias/:id/produtos/:produtoId", async (req, res) => {
  await categoriaController.excluirProduto(req, res);
});

// Ingredientes (itens)
router.post("/produtos/:produtoId/ingredientes", async (req, res) => {
  await categoriaController.criarItem(req, res);
});

router.get("/produtos/:produtoId/ingredientes", async (req, res) => {
  await categoriaController.listarItens(req, res);
});

router.put("/ingredientes/:itemId", async (req, res) => {
  await categoriaController.editarItem(req, res);
});

router.delete("/ingredientes/:itemId", async (req, res) => {
  await categoriaController.excluirItem(req, res);
});

export default router;
