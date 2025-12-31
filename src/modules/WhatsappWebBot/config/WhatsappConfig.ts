import { Client, LocalAuth } from 'whatsapp-web.js';
import fs from 'fs';
import path from 'path';
import qrcode from 'qrcode';

const SESSION_ID = 'whatsapp-session';
const AUTH_PATH = '/app/.wwebjs_auth';
const CACHE_PATH = '/app/.wwebjs_cache';
const CHROME_PATH = '/usr/bin/google-chrome';

// 🔧 Remove locks antigos de perfil do Chrome
function removeChromeLocks(baseDir: string) {
  if (!fs.existsSync(baseDir)) return;
  const removeRecursively = (dir: string) => {
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        removeRecursively(fullPath);
      } else if (['SingletonLock', 'LOCK', 'SingletonCookie'].includes(file)) {
        try {
          fs.rmSync(fullPath);
        } catch (err) {
          console.warn('⚠️ Falha ao remover lock:', fullPath, err);
        }
      }
    }
  };
  removeRecursively(baseDir);
}

// 📂 Garante as pastas
[AUTH_PATH, CACHE_PATH].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Pasta criada: ${dir}`);
  }
});

// Cria pasta public para o QR Code
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

let clientInstance: Client | null = null;

// 🚀 Inicia o cliente WhatsApp com Chrome real e persistência total
export const startWhatsappClient = async () => {

  if (clientInstance) {
    console.warn('⚠️ WhatsApp Client já iniciado, reutilizando instância');
    return clientInstance;
  }
  console.log('🚀 Iniciando cliente WhatsApp com Chrome nativo...');

  // 🔧 Remove locks antes de inicializar o Chrome
  const profilePath = `${CACHE_PATH}/${SESSION_ID}`;
  removeChromeLocks(profilePath);

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: SESSION_ID,
      dataPath: AUTH_PATH,
    }),
    puppeteer: {
      headless: true,
      executablePath: CHROME_PATH,
      args: [
        
         '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--remote-debugging-port=9222',
        `--user-data-dir=${profilePath}`,
      ],
    },
  });
  clientInstance = client;

  client.on('qr', async (qr) => {
    const qrImagePath = path.join(publicDir, 'qrcode.png');
    await qrcode.toFile(qrImagePath, qr);
    console.log("Novo qrcode gerado");
  });

  client.on('ready', () => {
    console.log('✅ Cliente WhatsApp conectado e pronto!');
  });

  client.on('auth_failure', (msg) => {
    console.error('❌ Falha de autenticação:', msg);
  });

  client.on('disconnected', (reason) => {
    console.warn('⚠️ Cliente desconectado:', reason);
  });

  try {
    await client.initialize();
  } catch (err) {
    console.error('❌ Erro ao iniciar o WhatsApp Web Client:', err);
  }

  return client;
};

// 🧹 Função opcional para limpar sessão manualmente
export const clearWhatsappSession = (): boolean => {
  try {
    const authPath = path.join(AUTH_PATH, SESSION_ID);
    const cachePath = path.join(CACHE_PATH, SESSION_ID);

    if (fs.existsSync(authPath)) {
      fs.rmSync(authPath, { recursive: true, force: true });
      console.log('🧹 Sessão do WhatsApp limpa com sucesso.');
    }

    if (fs.existsSync(cachePath)) {
      fs.rmSync(cachePath, { recursive: true, force: true });
      console.log('🧹 Cache do WhatsApp limpo com sucesso.');
    }

    return true;
  } catch (err) {
    console.error('❌ Erro ao limpar sessão/cache:', err);
    return false;
  }
};
