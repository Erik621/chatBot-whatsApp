export class MessageRepository {
    getResponse(message: string): string | null {
      if (message.toLowerCase() === 'oi') {
        return 'Olá! Como posso ajudar você hoje?';
      }
      return null;
    }
  }