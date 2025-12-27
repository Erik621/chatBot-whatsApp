import { Client } from 'whatsapp-web.js';

let whatsappClient: Client | null = null;
let whatsappReady = false;

export const setWhatsappClient = (client: Client) => {
  whatsappClient = client;

  client.on('ready', () => {
    whatsappReady = true;
    console.log('🟢 WhatsApp marcado como READY');
  });
};

export const getWhatsappClient = (): Client => {
  if (!whatsappClient || !whatsappReady) {
    throw new Error('⚠️ WhatsApp Client ainda não está pronto');
  }
  return whatsappClient;
};
