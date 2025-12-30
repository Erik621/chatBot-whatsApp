// src/modules/users/services/PedidoService.ts
import { AppDataSource } from '../../../../db/data-source';
import { Cliente } from '../../../../db/entities/interface/pedido/Cliente';
import { Pedido } from '../../../../db/entities/interface/pedido/Pedido';
import { PedidoItem } from '../../../../db/entities/interface/pedido/PedidoItem';
import { PedidoIngrediente } from '../../../../db/entities/interface/pedido/PedidoIngrediente';
import { Pagamento } from '../../../../db/entities/interface/pedido/Pagamento';
import { io } from '../../../server'; // ajuste o caminho conforme seu projeto
import { sendMessage } from '../../WhatsappWebBot/services/WhatsappService';



interface PedidoInput {
  cliente: {
    nome: string;
    endereco: string;
    telefone: string;
  };
  itens: {
    nomeProduto: string;
    imagem: string;
    precoUnitario: number;
    quantidade: number;
    adicionais?: {
      nome: string;
      valor: number;
      quantidade: number;
    }[];
  }[];
  formaPagamento: string;
  observacao?: string;
}

export class PedidoService {
  private clienteRepo = AppDataSource.getRepository(Cliente);
  private pedidoRepo = AppDataSource.getRepository(Pedido);
  private itemRepo = AppDataSource.getRepository(PedidoItem);
  private adicionalRepo = AppDataSource.getRepository(PedidoIngrediente);
  private pagamentoRepo = AppDataSource.getRepository(Pagamento);

  async criarPedido(data: PedidoInput): Promise<Pedido> {
    // 1. Criar cliente
    const novoCliente = this.clienteRepo.create(data.cliente);
    await this.clienteRepo.save(novoCliente);

    // 2. Criar pedido
    const pedido = this.pedidoRepo.create({ cliente: novoCliente, itens: [], pagamento: null!, observacao: data.observacao ?? "" });
    await this.pedidoRepo.save(pedido);

    // 3. Criar itens e adicionais
    const itensSalvos: PedidoItem[] = [];

    for (const item of data.itens) {
      const novoItem = this.itemRepo.create({
        pedido,
        nomeProduto: item.nomeProduto,
        imagem: item.imagem,
        precoUnitario: item.precoUnitario,
        quantidade: item.quantidade,
      });

      const itemSalvo = await this.itemRepo.save(novoItem);

      // Adicionais agora são criados após o item já existir no banco
      if (item.adicionais && item.adicionais.length > 0) {
        const adicionais = item.adicionais.map(ad =>
          this.adicionalRepo.create({
            pedidoItem: itemSalvo,
            nome: ad.nome,
            valor: ad.valor,
            quantidade: ad.quantidade,
          })
        );

        const adicionaisSalvos = await this.adicionalRepo.save(adicionais);
        itemSalvo.adicionais = adicionaisSalvos;
      } else {
        itemSalvo.adicionais = [];
      }

      itensSalvos.push(itemSalvo);
    }

    pedido.itens = itensSalvos;

    // 4. Criar pagamento
    const pagamento = this.pagamentoRepo.create({
      formaPagamento: data.formaPagamento,
      confirmado: false,
      pedido: pedido,
    });
    await this.pagamentoRepo.save(pagamento);


    pedido.pagamento = pagamento;

    // 5. Atualizar pedido final com itens e pagamento
    await this.pedidoRepo.save(pedido);
    // Emitir evento para front-end: "novoPedido"
    io.emit('novoPedido', pedido);

    return pedido;
  }

  /*   async listarPedidos(): Promise<Pedido[]> {
      return this.pedidoRepo.find();
    } */

  async listarPedidos(): Promise<Pedido[]> {
    return this.pedidoRepo.find({
      relations: ['cliente', 'itens', 'itens.adicionais', 'pagamento'],
      order: { criadoEm: "DESC" }
    });
  }



  async buscarPedidoPorId(id: number): Promise<Pedido | null> {
    return this.pedidoRepo.findOne({ where: { id } });
  }

  async confirmarPagamento(pedidoId: number): Promise<Pedido> {
    const pedido = await this.pedidoRepo.findOneOrFail({ where: { id: pedidoId } });
    pedido.pagamento.confirmado = true;
    await this.pagamentoRepo.save(pedido.pagamento);
    return pedido;
  }

  async finalizarPedido(pedidoId: number): Promise<Pedido> {
    const pedido = await this.pedidoRepo.findOneOrFail({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
    pedido.finalizado = true;
    pedido.finalizadoEm = new Date();
    await this.pedidoRepo.save(pedido);

    const telefone = pedido.cliente.telefone.replace(/\D/g, '');
    const mensagem = `
✅ Pedido nº ${pedido.id} realizado com sucesso!

📍 Para seguirmos com a entrega, por favor envie sua localização atual aqui no WhatsApp.
`.trim();

    await sendMessage(telefone, mensagem);

    return pedido;

  }

}

