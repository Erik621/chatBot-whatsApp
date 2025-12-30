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
  await whatsappClient.sendMessage(chatId, message);
};
