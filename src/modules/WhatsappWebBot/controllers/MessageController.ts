import { Message, Client } from 'whatsapp-web.js';
import { processNlpMessage } from '../../nlpBot/controllers/nlpController';

export const handleMessage = async (client: Client, message: Message) => {
  try {
    // Ignorar mensagens do sistema/broadcast
    if (message.from === 'status@broadcast') {
      console.warn('🚫 Ignorando mensagem do sistema/broadcast.');
      return;
    }

    const userText = message.body;

    // Processa a mensagem com NLP
    const responses = await processNlpMessage(userText);

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      console.warn('⚠️ Resposta NLP indefinida ou vazia para:', userText);
      return;
    }

    // 🛑 Nunca use client.sendMessage(message.from, ...)
    // ✅ Use apenas message.getChat() e chat.sendMessage()
    const chat = await message.getChat().catch(err => {
      console.error('❌ Erro ao obter chat:', err);
      return null;
    });

    if (!chat) return;

    // Envia todas as respostas separadamente
    for (const resposta of responses) {
      try {
        const formattedResponse = resposta.trim();
        await chat.sendMessage(formattedResponse);
      } catch (err) {
        console.error('❌ Erro ao enviar a mensagem (chat.sendMessage):', err);
      }
    }
  } catch (err) {
    console.error('❌ Erro ao processar ou responder a mensagem:', err);
  }
};
