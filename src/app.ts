import { startWhatsappClient } from './modules/WhatsappWebBot/config/WhatsappConfig';
import { MessageController } from './modules/WhatsappWebBot/controllers/MessageController';
import 'reflect-metadata';
import { AppDataSource } from '../db/data-source';
import dotenv from 'dotenv';

const messageController = new MessageController();

//

startWhatsappClient().then((client) => {
  client.on('message', async (message) => {
    await messageController.processMessage(client, message);
  });
}).catch((error) => {
  console.error('Erro ao iniciar o WhatsApp Web Client:', error);
});


AppDataSource.initialize()
  .then(() => {
    console.log('📦 Banco conectado com sucesso!');
    // iniciar o app
  })
  .catch((error) => console.error('Erro ao conectar no banco:', error));
