import { Client, LocalAuth } from 'whatsapp-web.js';
import fs from 'fs';
import path from 'path';
import qrcode from 'qrcode';

// ✅ Constante centralizada para o nome da sessão
const SESSION_ID = 'whatsapp-session';
const AUTH_PATH = '/app/.wwebjs_auth';
const CACHE_PATH = '/app/.wwebjs_cache';


// Garante as pastas
[AUTH_PATH, CACHE_PATH].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Pasta criada: ${dir}`);
  }
});
// Cria pasta public, se não existir
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// ✅ Função para iniciar o cliente do WhatsApp
export const startWhatsappClient = async () => {
  console.log('🚀 Iniciando cliente WhatsApp com Chrome nativo...');
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: SESSION_ID,
      dataPath: AUTH_PATH,
    }),
    puppeteer: {
      headless: true,
      executablePath: '/usr/bin/google-chrome', // 🚀 usa o Chrome instalado
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-background-timer-throttling',
        '--user-data-dir=/app/.wwebjs_cache'
      ],
    },

  });

  client.on('qr', async (qr) => {
    const qrImagePath = path.join(publicDir, 'qrcode.png');
    await qrcode.toFile(qrImagePath, qr);
  });

  client.on('ready', () => {
    console.log('🤖 Cliente WhatsApp está pronto!');
  });

  client.on('auth_failure', msg => {
    console.error('❌ Falha de autenticação:', msg);
  });

  client.on('disconnected', (reason) => {
    console.warn('⚠️ Cliente desconectado:', reason);
  });

  client.initialize();
  return client;
};

// ✅ Função para limpar sessão e cache
export const clearWhatsappSession = (): boolean => {
  try {
    const authPath = path.join('/app/.wwebjs_auth', SESSION_ID);
    const cachePath = path.join('/app/.wwebjs_cache'); // ajuste conforme necessário

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
    console.error('❌ Erro ao limpar sessão/cache:', err);
    return false;
  }
};
