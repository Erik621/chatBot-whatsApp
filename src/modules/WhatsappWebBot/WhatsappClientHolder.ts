import { Client } from 'whatsapp-web.js';

let whatsappClient: Client | null = null;
let whatsappReady = false;

export const setWhatsappClient = (client: Client) => {
  if (whatsappClient) {
    console.warn('⚠️ WhatsApp Client já definido, ignorando novo set');
    return;
  }

  whatsappClient = client;
  whatsappReady = true;
};
export const getWhatsappClient = (): Client => {
  if (!whatsappClient || !whatsappReady) {
    throw new Error('⚠️ WhatsApp Client indisponível');
  }
  return whatsappClient;
};
