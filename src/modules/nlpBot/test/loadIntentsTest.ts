import { AppDataSource } from "../../../db/data-source";
import { NlpDataLoaderService } from "../services/NlpDataLoaderService";

async function testLoadIntents() {
  await AppDataSource.initialize();
  const dataLoader = new NlpDataLoaderService();
  const intents = await dataLoader.loadIntents();
  console.log(JSON.stringify(intents, null, 2));
  process.exit(0);
}

testLoadIntents().catch(console.error);
