import { Client } from 'whatsapp-web.js';

let whatsappClient: Client | null = null;

export const setWhatsappClient = (client: Client) => {
  whatsappClient = client;
};

export const getWhatsappClient = (): Client => {
  if (!whatsappClient) {
    throw new Error('❌ WhatsApp Client ainda não foi inicializado');
  }
  return whatsappClient;
};
