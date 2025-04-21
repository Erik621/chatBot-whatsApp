import { MessageRepository } from '../repositories/MessageRepository';

export class MessageService {
  private messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  handleMessage(message: string): string | null {
    return this.messageRepository.getResponse(message);
  }
}
