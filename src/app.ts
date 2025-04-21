import { startWhatsappClient } from './modules/WhatsappWebBot/config/WhatsappConfig';
import { MessageController } from './modules/WhatsappWebBot/controllers/MessageController';

const messageController = new MessageController();

//

startWhatsappClient().then((client) => {
  client.on('message', async (message) => {
    await messageController.processMessage(client, message);
  });
}).catch((error) => {
  console.error('Erro ao iniciar o WhatsApp Web Client:', error);
});
