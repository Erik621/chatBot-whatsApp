// src/modules/users/controllers/PedidoController.ts
import { Request, Response } from 'express';
import { PedidoService } from '../services/PedidoService';

const pedidoService = new PedidoService();

export class PedidoController {
  async criarPedido(req: Request, res: Response): Promise<Response> {
    try {
      const novoPedido = await pedidoService.criarPedido(req.body);
      return res.status(201).json(novoPedido);
    } catch (err: any) {

      if (
        err?.message &&
        err.message.toLowerCase().includes('fechado')
      ) {
        return res.status(403).json({
          message: err.message,
        });
      }

      console.error('Erro ao criar pedido:', err);

      return res.status(500).json({
        message: 'Erro ao criar pedido',
      });
    }
  }

  async listarPedidos(req: Request, res: Response): Promise<Response> {
    try {
      const pedidos = await pedidoService.listarPedidos();
      return res.json(pedidos);
    } catch (error: any) {
      console.error("Erro ao listar pedidos:", error.message);
      return res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
  }

  async buscarPedidoPorId(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const pedido = await pedidoService.buscarPedidoPorId(id);
      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
      return res.json(pedido);
    } catch (error: any) {
      console.error("Erro ao buscar pedido:", error.message);
      return res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  }

  async confirmarPagamento(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const pedido = await pedidoService.confirmarPagamento(id);
      return res.json(pedido);
    } catch (error: any) {
      console.error("Erro ao confirmar pagamento:", error.message);
      return res.status(500).json({ error: 'Erro ao confirmar pagamento' });
    }
  }

  async finalizarPedido(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      await pedidoService.finalizarPedido(id);
      return res.status(204).send(); // sucesso sem corpo
    } catch (error: any) {
      console.error("Erro ao finalizar pedido:", error.message);
      return res.status(500).json({ error: 'Erro ao finalizar pedido' });
    }
  }


}
