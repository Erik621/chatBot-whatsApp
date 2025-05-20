//import { MessageService } from '../services/MessageService';
import { Message,Client } from 'whatsapp-web.js';
import { processNlpMessage } from '../../nlpBot/controllers/nlpController';


/* export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  async processMessage(client: any, message: Message) {
    const response = this.messageService.handleMessage(message.body);
    if (response) {
      await client.sendMessage(message.from, response);
    }
  }
} */
  export const handleMessage = async (client: Client, message: Message) => {
    const userText = message.body;
  
    // Processa a mensagem com NLP
    const response = await processNlpMessage(userText);
  
    // Envia a resposta pelo WhatsApp
    await client.sendMessage(message.from, response);
  };