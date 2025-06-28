import express, { json } from 'express';
import 'node-nlp';
import path from 'path';
import { startWhatsappClient,clearWhatsappSession } from './modules/WhatsappWebBot/config/WhatsappConfig';
import { /* MessageController */handleMessage } from './modules/WhatsappWebBot/controllers/MessageController';
import 'reflect-metadata';
import { AppDataSource } from '../db/data-source';
import dotenv from 'dotenv';
import userRoutes from './modules/interface/routes';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Servir arquivos estáticos da pasta public
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  next()
})
app.use(cors())
app.use(json())
app.use(express.json());
app.use('/api/users', userRoutes);


export default app;

app.use('/static',express.static(path.join(__dirname, './modules/WhatsappWebBot', 'public')));

app.get('/cleansession', (req, res) => {
  const result = clearWhatsappSession();
  if (result) {
    res.send('✅ Sessão limpa com sucesso!');
  } else {
    res.send('⚠️ Nenhuma sessão para limpar ou erro ao limpar.');
  }
});


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
        <img src="/static/qrcode.png" alt="QR Code do WhatsApp" width="300"/>
        <p>Atualize para obter um novo código</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


//const messageController = new MessageController();

//

startWhatsappClient().then((client) => {
  client.on('message', async (message) => {
    await handleMessage(client, message);
  });
}).catch((error) => {
  console.error('Erro ao iniciar o WhatsApp Web Client:', error);
});
dotenv.config();

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Banco conectado com sucesso!');
    // iniciar o app
  })
  .catch((error) => console.error('Erro ao conectar no banco:', error));

