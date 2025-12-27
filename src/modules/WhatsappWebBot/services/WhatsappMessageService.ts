import { getWhatsappClient } from '../WhatsappClientHolder';

function formatWhatsappNumber(telefone: string): string {
  // remove tudo que não for número
  const clean = telefone.replace(/\D/g, '');

  // se já tiver 55, mantém
  if (clean.startsWith('55')) {
    return `${clean}@c.us`;
  }

  // Brasil padrão
  return `55${clean}@c.us`;
}

export class WhatsappMessageService {
  static async enviarConfirmacaoPedido(
    telefone: string,
    pedidoId: number
  ): Promise<void> {
    try {
      const client = getWhatsappClient();
      const chatId = formatWhatsappNumber(telefone);
     


      await client.sendMessage(
        chatId,
        `✅ Pedido nº ${pedidoId} realizado com sucesso!\n\n📍 Envie sua localização para realizarmos a entrega.`
      );
    } catch (error: any) {
     console.warn(
        '⚠️ WhatsApp indisponível no momento, mensagem não enviada:',
        error.message
      );
    }
  }
}
