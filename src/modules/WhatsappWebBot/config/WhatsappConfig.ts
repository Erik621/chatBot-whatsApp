import { Client, LocalAuth } from 'whatsapp-web.js';
import fs from 'fs';
import path from 'path';
import qrcode from 'qrcode';

// Cria pasta public, se não existir
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

export const startWhatsappClient = async () => {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'whatsapp-session' }),
    puppeteer: {
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  client.on('qr', async (qr) => {
    const qrImagePath = path.join(publicDir, 'qrcode.png');
    await qrcode.toFile(qrImagePath, qr);
    console.log('✅ QR Code gerado em /public/qrcode.png');
  });

  client.on('ready', () => {
    console.log('🤖 Cliente WhatsApp está pronto!');
  });

  client.initialize();

  return client;
};
