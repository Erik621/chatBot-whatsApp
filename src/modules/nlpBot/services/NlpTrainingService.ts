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
      try {
        this.manager.load(this.modelPath);
        console.log(`✅ Modelo NLP carregado de: ${this.modelPath}`);
      } catch (err) {
        console.error('❌ Falha ao carregar o modelo especificado:', err);
      }
    } else {
      console.warn('⚠️ Modelo NLP não encontrado no caminho esperado:', this.modelPath);
    }
    
  }

  async processMessage(message: string): Promise<string[]> {
    try {
      const result = await this.manager.process('pt', message);
  
      if (!result || !result.intent || result.intent === 'None') {
        return [
          'Parece que não entendi sua mensagem 🤔 Mas aqui é muito fácil fazer seu pedido! ' +
          'Basta acessar nosso cardápio digital no link abaixo 👇\n' +
          'https://empireofk.com.br/card'
        ];
      }
  
      const answers = result.answers || [];
  
      if (answers.length === 0) {
        return ['Desculpe, ainda não tenho uma resposta para isso.'];
      }
  
      // Extrai o texto da resposta (answer)
      return answers.map((a: any) => a.answer);
    } catch (error) {
      console.error('❌ Erro ao processar mensagem NLP:', error);
      return ['Ocorreu um erro ao tentar entender sua mensagem. Tente novamente mais tarde.'];
    }
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

}
