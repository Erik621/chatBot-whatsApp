// @ts-ignore
const { NlpManager } = require('node-nlp');

async function runTest() {
  const manager = new NlpManager({ languages: ['pt'], forceNER: true });
  manager.load('model.nlp');

  const response = await manager.process('pt', 'qual é o seu nome?');

  console.log('=== Resultado da predição ===');
  console.log(`Intenção: ${response.intent}`);
  console.log(`Resposta: ${response.answer}`);
}

runTest();
