import express from 'express';
import path from 'path';
import './app';

const app = express();
const PORT = 3000;

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Página HTML que mostra o QR code
app.get('/qrcode', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>QR Code do WhatsApp</title>
        <meta http-equiv="refresh" content="10" />
      </head>
      <body style="text-align: center; margin-top: 50px;">
        <h1>Escaneie o QR Code</h1>
        <img src="/qrcode.png" alt="QR Code do WhatsApp" width="300"/>
        <p>Atualize para obter um novo código</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
