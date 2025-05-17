// src/modules/nlpBot/services/NlpTrainingService.ts

// @ts-ignore
const { NlpManager } = require('node-nlp');

import { NlpDataLoaderService } from './NlpDataLoaderService';

export class NlpTrainingService {
  private manager: any;
  private dataLoader: NlpDataLoaderService;

  constructor() {
    this.manager = new NlpManager({ languages: ['pt'], forceNER: true });
    this.dataLoader = new NlpDataLoaderService();
  }
/*   private manager: any;

  constructor() {
    this.manager = new NlpManager({ languages: ['pt'], forceNER: true });
    this.manager.load('model.nlp');
  } */
  

  async processMessage(message: string): Promise<string> {
    const result = await this.manager.process('pt', message);
    return result.answer || 'Desculpe, não entendi sua mensagem.';
  }
/* 
  async trainAndSaveModel(modelFilePath: string): Promise<void> {
    const intentsData = await this.dataLoader.loadIntents();

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

    this.manager.save(modelFilePath);
    console.log(`Modelo salvo em: ${modelFilePath}`);
  }

  getManager(): any {
    return this.manager;
  } */
}


