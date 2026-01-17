import { Client } from 'whatsapp-web.js';

let whatsappClient: Client | null = null;

export const setWhatsappClient = (client: Client) => {
  whatsappClient = client;
};

export const sendMessage = async (to: string, message: string) => {
  if (!whatsappClient) {
    throw new Error('WhatsApp client não inicializado');
  }

  const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
   try {
    const chat = await whatsappClient.getChatById(chatId);

    if (!chat) {
      console.warn('⚠️ Chat não encontrado:', chatId);
      return;
    }

    await chat.sendMessage(message, { sendSeen: false });
  } catch (err) {
    console.error('❌ Erro ao enviar mensagem WhatsAppService:', err);
  }
};
