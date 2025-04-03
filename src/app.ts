
import { startVenomClient } from './config/VenomConfig';
import { MessageController } from './controllers/MessageController';

const messageController = new MessageController();

startVenomClient().then((client) => {
  client.onMessage(async (message) => {
    await messageController.processMessage(client, message);
  });
}).catch((error) => {
  console.error('Erro ao iniciar o Venom Client:', error);
}); 