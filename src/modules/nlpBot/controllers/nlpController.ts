import nlpService from '../services/NlpSingleton';


export async function processNlpMessage(text: string): Promise<string[]> {
  try {
    if (!text || text.trim() === '') {
      return ['⚠️ Mensagem vazia. Por favor, envie algo.'];
    }

    const responses = await nlpService.processMessage(text);

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return ['🤖 Desculpe, não consegui gerar uma resposta.'];
    }

    return responses;
  } catch (err) {
    console.error('❌ Erro ao processar mensagem NLP:', err);
    return ['⚠️ Ocorreu um erro ao tentar entender sua mensagem.'];
  }
}
