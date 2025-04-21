import { MessageService } from '../services/MessageService';
import { Message } from 'whatsapp-web.js';

export class MessageController {
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
}
