import { MessageService } from '../services/MessageService';

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  async processMessage(client: any, message: any) {
    const response = this.messageService.handleMessage(message.body);
    if (response) {
      await client.sendText(message.from, response);
    }
  }
}