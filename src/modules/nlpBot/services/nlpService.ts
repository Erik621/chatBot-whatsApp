/* // src/nlpBot/nlpService.ts
import { NlpManager } from 'node-nlp';
import { AppDataSource } from '../../../db/connection';
import { Intent } from '../../../db/entities/Intent.entity';

export class NlpService {
  private manager: NlpManager;

  constructor() {
    this.manager = new NlpManager({ languages: ['pt'], forceNER: true });
  }

  async trainModel() {
    const repo = AppDataSource.getRepository(Intent);
    const intents = await repo.find();

    for (const intent of intents) {
      intent.patterns.forEach((pattern) => {
        this.manager.addDocument('pt', pattern, intent.tag);
      });
      intent.responses.forEach((response) => {
        this.manager.addAnswer('pt', intent.tag, response);
      });
    }

    await this.manager.train();
    this.manager.save(); // opcional
  }

  async getResponse(message: string): Promise<string> {
    const response = await this.manager.process('pt', message);
    return response.answer ?? "Desculpe, não entendi. Pode repetir?";
  }
} */
