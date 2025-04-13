
import { startVenomClient } from './modules/WhatsappWebBot/config/VenomConfig';
import { MessageController } from './modules/WhatsappWebBot/controllers/MessageController';

const messageController = new MessageController();

startVenomClient().then((client) => {
  client.onMessage(async (message) => {
    await messageController.processMessage(client, message);
  });
}).catch((error) => {
  console.error('Erro ao iniciar o Venom Client:', error);
}); 