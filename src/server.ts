import express, { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import 'node-nlp';
import http from 'http';
import { Server } from 'socket.io';

import { startWhatsappClient, clearWhatsappSession } from './modules/WhatsappWebBot/config/WhatsappConfig';
import { handleMessage } from './modules/WhatsappWebBot/controllers/MessageController';
import interfaceRoutes from './modules/interface/routes';
import { AppDataSource } from './db/data-source';

import { setWhatsappClient } from './modules/WhatsappWebBot/services/WhatsappService';
import { WhatsappContatoRepository } from './modules/interface/repositories/InterfaceRepository';
import { HorarioFuncionamentoService } from './shared/services/HorarioFuncionamentoService';


console.log('🚀 Processo Node iniciado:', process.pid);

dotenv.config();

const app = express();
const PORT = 3000;

// Criar servidor HTTP
const server = http.createServer(app);

// Criar servidor WebSocket
const io = new Server(server, {
  cors: {
    origin: "*", // pode limitar depois ao seu domínio
  },
  path: "/api/socket.io/", // 👈 Aqui está o segredo
});

// Guardar `io` para usar em outros arquivos
export { io };

// 🛡️ Middleware CORS e headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
app.use(cors());
app.use(express.json());

// 📂 Servir arquivos de imagem
app.use(
  '/api/imagens',
  express.static(path.resolve(process.cwd(), 'uploads/imagens'))
);
// 🌐 API principal
app.use('/api', interfaceRoutes);

// 🖼️ Servir QR Code
app.use('/static', express.static(path.join(__dirname, './modules/WhatsappWebBot', 'public')));

app.get('/api/qrcode', (req: Request, res: Response) => {
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
app.get('/api/cleansession', (req: Request, res: Response) => {
  const result = clearWhatsappSession();
  if (result) {
    res.send('✅ Sessão limpa com sucesso!');
  } else {
    res.send('⚠️ Nenhuma sessão para limpar ou erro ao limpar.');
  }
});


// 🚀 Iniciar servidor HTTP com WebSocket
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});

// 🤖 Iniciar cliente do WhatsApp
startWhatsappClient()
  .then((client) => {



    setWhatsappClient(client);


    client.on('message', async (message) => {
      try {
        // Ignorar status e grupos
        if (message.from === 'status@broadcast') return;
        if (!message.from.endsWith('@c.us')) return;

        const whatsappId = message.from;

        const telefone = whatsappId
          .replace('@c.us', '')
          .replace(/^55/, '');
        // 🔹 Salva ou atualiza contato
        const contatoExistente = await WhatsappContatoRepository.findOne({
          where: { whatsappId }
        });

        if (contatoExistente) {
          contatoExistente.ultimaInteracao = new Date();
          await WhatsappContatoRepository.save(contatoExistente);
        } else {
          const novoContato = WhatsappContatoRepository.create({
            whatsappId,
            telefone,
            ultimaInteracao: new Date()
          });

          await WhatsappContatoRepository.save(novoContato);
          console.log('📇 Novo contato WhatsApp salvo:', whatsappId);
        }

        // 🔒 Verifica horário ANTES de qualquer resposta do bot
        if (!HorarioFuncionamentoService.estaAberto()) {
          await message.reply(
            HorarioFuncionamentoService.mensagemForaHorario()
          );
          return;
        }


        // 🔹 Continua o fluxo normal do bot (NLP etc)
        await handleMessage(client, message);
      } catch (err) {
        console.error('❌ Erro ao processar mensagem WhatsApp:', err);
      }

    }
    );
    
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
