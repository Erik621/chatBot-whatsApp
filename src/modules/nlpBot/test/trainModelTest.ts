import { AppDataSource } from "../../../../db/data-source";
import { NlpTrainingService } from "../services/NlpTrainingService";

async function trainModel() {
  await AppDataSource.initialize();
  const trainingService = new NlpTrainingService();
  await trainingService.trainAndSaveModel('model.nlp');
  process.exit(0);
}

trainModel().catch(console.error);
