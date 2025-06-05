import { AppDataSource } from "../../../../db/data-source"
import { Intent } from "../../../../db/entities/nlpBot/Intent";
import { Example } from "../../../../db/entities/nlpBot/Example";
import { Answer } from "../../../../db/entities/nlpBot/Answer";

interface IntentData {
  intent: string;
  examples: string[];
  answers: string[];
}

export class NlpDataLoaderService {
  private intentRepository = AppDataSource.getRepository(Intent);

  async loadIntents(): Promise<IntentData[]> {
    // Buscar todas as intents com seus exemplos e respostas
    const intents = await this.intentRepository.find({
      relations: ["examples", "answers"],
    });

    // Mapear para o formato que vamos usar no treinamento
    const formattedIntents = intents.map(intent => ({
      intent: intent.name,
      examples: intent.examples.map(example => example.text),
      answers: intent.answers.map(answer => answer.text),
    }));

    return formattedIntents;
  }
}
