/* 
import { NlpManager } from 'node-nlp';
import { NlpDataLoaderService } from './NlpDataLoaderService';

export class NlpTrainingService {
  private manager: NlpManager;
  private dataLoader: NlpDataLoaderService;

  constructor() {
    this.manager = new NlpManager({ languages: ['pt'], forceNER: true });
    this.dataLoader = new NlpDataLoaderService();
  }

  async trainAndSaveModel(modelFilePath: string): Promise<void> {
    const intentsData = await this.dataLoader.loadIntents();

    // Adicionar as frases de treinamento
    for (const intentData of intentsData) {
      for (const example of intentData.examples) {
        this.manager.addDocument('pt', example, intentData.intent);
      }
      for (const answer of intentData.answers) {
        this.manager.addAnswer('pt', intentData.intent, answer);
      }
    }

    console.log('Treinando modelo NLP...');
    await this.manager.train();
    console.log('Modelo treinado!');

    // Salvar modelo em arquivo
    this.manager.save(modelFilePath);
    console.log(`Modelo salvo em: ${modelFilePath}`);
  }

  getManager(): NlpManager {
    return this.manager;
  }
}
 */