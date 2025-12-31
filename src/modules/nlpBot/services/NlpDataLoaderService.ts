//src/modules/nlpBot/services/NlpDataLoaderService.ts
import { AppDataSource } from "../../../db/data-source";
import { Intent } from "../../../db/entities/nlpBot/Intent";

interface IntentData {
  intent: string;
  examples: string[];
  answers: string[];
}

export class NlpDataLoaderService {
  private intentRepository = AppDataSource.getRepository(Intent);

  async loadIntents(): Promise<IntentData[]> {
    try {
      const intents = await this.intentRepository.find({
        relations: ["examples", "answers"],
      });

      if (!intents || intents.length === 0) {
        console.warn('⚠️ Nenhuma intent encontrada no banco.');
        return [];
      }

      const formattedIntents = intents.map(intent => ({
        intent: intent.name,
        examples: intent.examples?.map(example => example.text) || [],
        answers: intent.answers?.map(answer => answer.text) || [],
      }));

      return formattedIntents;
    } catch (err) {
      console.error('❌ Erro ao carregar intents do banco:', err);
      return [];
    }
  }
}
