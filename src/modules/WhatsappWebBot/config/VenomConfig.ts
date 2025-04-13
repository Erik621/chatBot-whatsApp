import * as venom from 'venom-bot';
import fs from 'fs';
import path from 'path';


console.info = () => {};
console.debug = () => {};
console.warn = () => {};
console.log = (msg?: any) => {
  if (
    typeof msg === 'string' &&
    (msg.includes('launching') ||
     msg.includes('Checking') ||
     msg.includes('INFO:') ||
     msg.includes('[PUPPETEER]'))
  ) {
    return;
  }
  // Descomente se quiser deixar logs que você escolher
  // process.stdout.write(`[LOG] ${msg}\n`);
};

/**
 * Inicializa o cliente Venom e salva o QR Code como imagem
 */
export const startVenomClient = () => {
  return venom.create(
    'session-name',
    (base64Qr: string) => {
      const qrImage = base64Qr.replace(/^data:image\/png;base64,/, '');
      const publicDir = path.join(__dirname, '../..', '../..', 'public');
      const filePath = path.join(publicDir, 'qrcode.png');

      // Garante que o diretório public existe
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      // Salva o QR Code no disco
      fs.writeFileSync(filePath, qrImage, { encoding: 'base64' });
      console.log('✅ QR code salvo em /public/qrcode.png');
    },
    undefined,
    {
      headless: 'old',
      browserArgs: [''],
      autoClose: 0,
      disableWelcome: true,
      updatesLog: false,
      disableSpins: true,
      logQR: false
    }
  );
};
