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
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      //dumpio: true // mostra logs do puppeteer
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

  client.on('auth_failure', msg => {
    console.error('Falha de autenticação:', msg);
  });

  client.on('disconnected', (reason) => {
    console.warn('Cliente desconectado:', reason);
  });

  client.initialize();
  return client;
};

// ✅ NOVA FUNÇÃO PARA LIMPAR SESSÃO
export const clearWhatsappSession = (): boolean => {
  try {
    const authPath = path.join('/app/.wwebjs_auth', 'session-whatsapp-session');
    const cachePath = path.join('/app/.wwebjs_cache'); // ajuste conforme seu caminho real

    if (fs.existsSync(authPath)) {
      fs.rmSync(authPath, { recursive: true, force: true });
      console.log('🧹 Sessão do WhatsApp limpa com sucesso.');
    } else {
      console.log('⚠️ Nenhuma sessão encontrada.');
    }

    if (fs.existsSync(cachePath)) {
      fs.rmSync(cachePath, { recursive: true, force: true });
      console.log('🧹 Cache do WhatsApp limpo com sucesso.');
    } else {
      console.log('⚠️ Nenhum cache encontrado.');
    }

    return true;
  } catch (err) {
    console.error('Erro ao limpar sessão/cache:', err);
    return false;
  }
};
