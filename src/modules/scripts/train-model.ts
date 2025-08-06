// src/scripts/train-model.ts
import { AppDataSource } from '../../../db/data-source';
import { NlpTrainingService } from '../nlpBot/services/NlpTrainingService';
import path from 'path';

async function main() {
  
  

const modelPath = path.resolve(__dirname, '../../scripts/model.nlp');
  

  await AppDataSource.initialize();
  console.log("📦 DataSource inicializado");
  const trainer = new NlpTrainingService();
  await trainer.trainAndSaveModel();
  console.log('✅ Modelo NLP treinado com sucesso!');
}

main().catch((err) => {
  console.error('❌ Erro ao treinar modelo NLP:', err);
  process.exit(1);
});
