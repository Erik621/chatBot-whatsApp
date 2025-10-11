import express, { json } from 'express';
import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import 'node-nlp';
import http from 'http'; // ⬅️ IMPORTANTE para criar o servidor HTTP
import { Server } from 'socket.io'; // ⬅️ Socket.IO

import { startWhatsappClient, clearWhatsappSession } from './modules/WhatsappWebBot/config/WhatsappConfig';
import { handleMessage } from './modules/WhatsappWebBot/controllers/MessageController';
import interfaceRoutes from './modules/interface/routes';
import { AppDataSource } from '../db/data-source';

dotenv.config();

const app = express();
const PORT = 3000;

// Criar servidor HTTP
const server = http.createServer(app);

// Criar servidor WebSocket
const io = new Server(server, {
  cors: {
    origin: "*", // depois podemos restringir para seu domínio
  },
});

// Guardar `io` para usar em outros arquivos
export { io };

// 🛡️ Middleware CORS e headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  next()
});
app.use(cors());
app.use(json());
app.use(express.json());

// 📂 Servir arquivos de imagem
app.use('/api/imagens', express.static(path.resolve(__dirname, '../public/imagens')));

// 🌐 API principal
app.use('/api', interfaceRoutes);

// 🖼️ Servir QR Code
app.use('/static', express.static(path.join(__dirname, './modules/WhatsappWebBot', 'public')));

app.get('/api/qrcode', (req, res) => {
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

// 🧹 Limpar sessão
app.get('/api/cleansession', (req, res) => {
  const result = clearWhatsappSession();
  if (result) {
    res.send('✅ Sessão limpa com sucesso!');
  } else {
    res.send('⚠️ Nenhuma sessão para limpar ou erro ao limpar.');
  }
});

// Conexão do socket
io.on('connection', (socket) => {
  console.log('📡 Cliente conectado ao WebSocket');

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado WebSocket');
  });
});

// 🚀 Iniciar servidor HTTP com WebSocket
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});

// 🤖 Iniciar cliente do WhatsApp
startWhatsappClient()
  .then((client) => {
    client.on('message', async (message) => {
      await handleMessage(client, message);
    });
  })
  .catch((error) => {
    console.error('❌ Erro ao iniciar o WhatsApp Web Client:', error);
  });

// 🗄️ Iniciar conexão com o banco
AppDataSource.initialize()
  .then(() => {
    console.log('📦 Banco conectado com sucesso!');
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar no banco:', error);
  });

// Evento de conexão WebSocket
io.on('connection', (socket) => {
  console.log('📡 Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

export default app;
