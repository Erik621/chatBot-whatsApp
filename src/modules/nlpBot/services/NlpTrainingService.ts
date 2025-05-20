// src/modules/nlpBot/services/NlpTrainingService.ts

// @ts-ignore
const { NlpManager } = require('node-nlp');
import fs from 'fs';
import path from 'path';
import { NlpDataLoaderService } from './NlpDataLoaderService';

export class NlpTrainingService {
  private manager: any;
  private dataLoader: NlpDataLoaderService;
  private modelPath: string;

  constructor() {
    this.manager = new NlpManager({ languages: ['pt'], forceNER: true });
    this.dataLoader = new NlpDataLoaderService();
    this.modelPath = path.resolve(__dirname, '../../scripts/model.nlp');

    // Carrega o modelo se já existir
    if (fs.existsSync(this.modelPath)) {
      this.manager.load(this.modelPath);
      console.log(`✅ Modelo NLP carregado de: ${this.modelPath}`);
    } else {
      console.warn('⚠️ Modelo NLP não encontrado. Treine o modelo com "npm run train:nlp".');
    }
  }

  async processMessage(message: string): Promise<string> {
    const result = await this.manager.process('pt', message);
    return result.answer || 'Desculpe, não entendi sua mensagem.';
  }

  async trainAndSaveModel(): Promise<void> {
    const intentsData = await this.dataLoader.loadIntents();

    for (const intentData of intentsData) {
      for (const example of intentData.examples) {
        this.manager.addDocument('pt', example, intentData.intent);
      }
      for (const answer of intentData.answers) {
        this.manager.addAnswer('pt', intentData.intent, answer);
      }
    }

    console.log('🔧 Treinando modelo NLP...');
    await this.manager.train();
    console.log('✅ Modelo treinado!');

    this.manager.save(this.modelPath);
    console.log(`💾 Modelo salvo em: ${this.modelPath}`);
  }

  getManager(): any {
    return this.manager;
  }
}
