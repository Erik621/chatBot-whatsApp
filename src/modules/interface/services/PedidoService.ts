// src/modules/users/services/PedidoService.ts
import { AppDataSource } from '../../../db/data-source';
import { Cliente } from '../../../db/entities/interface/pedido/Cliente';
import { Pedido } from '../../../db/entities/interface/pedido/Pedido';
import { PedidoItem } from '../../../db/entities/interface/pedido/PedidoItem';
import { PedidoIngrediente } from '../../../db/entities/interface/pedido/PedidoIngrediente';
import { Pagamento } from '../../../db/entities/interface/pedido/Pagamento';
import { io } from '../../../server'; // ajuste o caminho conforme seu projeto
import { sendMessage } from '../../WhatsappWebBot/services/WhatsappService';
import { WhatsappContatoRepository } from '../repositories/InterfaceRepository';
import { gerarPossiveisTelefones } from '../utils/telefone';
import { HorarioFuncionamentoService } from '../../../shared/services/HorarioFuncionamentoService';


function formatarTelefone(telefone: string): string {
  const numero = telefone.replace(/\D/g, '');

  // Garante código do Brasil
  if (!numero.startsWith('55')) {
    return `55${numero}@c.us`;
  }

  return `${numero}@c.us`;
}

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
    const CHAVE_PIX = '967579f7-c4f1-4494-a69c-5d45cfc8fe3f';

    if (!HorarioFuncionamentoService.estaAberto()) {
      throw new Error(
        'Estabelecimento fechado no momento.'
      );
    }

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


    const telefonesPossiveis = gerarPossiveisTelefones(
      data.cliente.telefone,
      '77'
    );

    const contato = await WhatsappContatoRepository.findOne({
      where: telefonesPossiveis.map(tel => ({ telefone: tel }))
    });

    try {
      const whatsappDestino =
        contato?.whatsappId ??
        formatarTelefone(data.cliente.telefone);

      console.log('📨 Enviando mensagem WhatsApp para:', whatsappDestino);

      // Mensagem padrão
      await sendMessage(
        whatsappDestino,
        `✅ Pedido nº ${pedido.id} realizado com sucesso!\n\n📍 Para seguirmos com a entrega, por favor envie sua localização atual aqui no WhatsApp.`
      );

      // PIX
      if (data.formaPagamento === 'Pix') {
        await sendMessage(
          whatsappDestino,
          `💰 *Pagamento via PIX*\n\nVi que você selecionou a forma de pagamento *PIX*.\n\n🔑 Chave PIX:\n${CHAVE_PIX}\nSimone Ribeiro de Queiroz\nNubank\n\n📎 Após realizar o pagamento, envie o *comprovante* por aqui.`
        );

        await sendMessage(whatsappDestino, CHAVE_PIX);
      }


    } catch (err) {
      console.error('❌ Falha ao enviar WhatsApp:', err);
    }

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
    const pedido = await this.pedidoRepo.findOneOrFail({ where: { id: pedidoId } });
    pedido.finalizado = true;
    pedido.finalizadoEm = new Date();
    return await this.pedidoRepo.save(pedido);
  }

}

