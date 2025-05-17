import { NlpTrainingService } from '../services/NlpTrainingService';

const nlpService = new NlpTrainingService();

export async function processNlpMessage(text: string): Promise<string> {
  return await nlpService.processMessage(text);
}
