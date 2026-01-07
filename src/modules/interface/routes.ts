// src/modules/users/routes.ts
import { Router } from 'express';
import { UserController, CategoriaController } from './controllers/InterfaceController';
import { PedidoController } from './controllers/PedidoController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const userController = new UserController();
const categoriaController = new CategoriaController();
const pedidoController = new PedidoController();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../../../uploads/imagens');
    // Cria a pasta se não existir
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Tipo de arquivo não permitido'));
    }
    cb(null, true);
  }
});

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

router.post("/upload", upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  const imagePath = `/imagens/${req.file.filename}`;
  return res.status(200).json({ caminho: imagePath });
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

// PEDIDOS
router.post("/pedidos", async (req, res) => {
  await pedidoController.criarPedido(req, res);
});

router.get("/pedidos", async (req, res) => {
  await pedidoController.listarPedidos(req, res);
});

router.get("/pedidos/:id", async (req, res) => {
  await pedidoController.buscarPedidoPorId(req, res);
});

router.patch("/pedidos/:id/pagamento", async (req, res) => {
  await pedidoController.confirmarPagamento(req, res);
});

router.patch("/pedidos/:id/finalizar", async (req, res) => {
  await pedidoController.finalizarPedido(req, res);
});

export default router;
