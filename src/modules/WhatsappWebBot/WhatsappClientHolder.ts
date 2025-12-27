import { Client } from 'whatsapp-web.js';

let whatsappClient: Client | null = null;
let whatsappReady = false;

export const setWhatsappClient = (client: Client) => {
  if (!whatsappClient) {
    whatsappClient = client;
    whatsappReady = true; // 👈 assume ready porque só chamamos depois do ready
  }
};

export const getWhatsappClient = (): Client => {
  if (!whatsappClient || !whatsappReady) {
    throw new Error('⚠️ WhatsApp Client indisponível');
  }
  return whatsappClient;
};
