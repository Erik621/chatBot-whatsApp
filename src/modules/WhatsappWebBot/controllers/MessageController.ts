import { Message, Client } from 'whatsapp-web.js';
import { processNlpMessage } from '../../nlpBot/controllers/nlpController';

/* 
// helpers inside MessageController.ts (ou importados)
const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

async function safeGetChat(client: Client, message: Message, retries = 3) {
  // Tenta message.getChat(), depois client.getChatById(), com retries simples
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const chat = await message.getChat();
      if (chat && chat.id && chat.id._serialized) return chat;
    } catch (e) {
      // ignore, vamos tentar fallback
    }

    try {
      const chatById = await client.getChatById(message.from);
      if (chatById && chatById.id && (chatById.id._serialized || chatById.id._serialized)) {
        return chatById;
      }
    } catch (e) {
      // ignore
    }

    // backoff exponencial simples
    await wait(150 * (attempt + 1));
  }
  return null;
}

async function safeSendMessage(client: Client, message: Message, text: string) {
  // valida from
  if (!message?.from || message.from === 'status@broadcast') return false;

  // tenta obter chat seguro
  const chat = await safeGetChat(client, message, 3);
  const sendOptions = { sendSeen: false };

  if (chat) {
    // Verificações extras (algumas props podem vir undefined em certas versões)
    const hasId = !!(chat.id && (chat.id._serialized ?? (chat.id as any)._serialized));
    if (!hasId) {
      console.warn('safeSendMessage: chat sem id serializado, fallback para client.sendMessage');
    } else {
      try {
        // opcional: pequeno delay antes de enviar para evitar race conditions do sendSeen
        await wait(200);
        await (chat as any).sendMessage(text, sendOptions);
        return true;
      } catch (err) {
        console.error('safeSendMessage: falha via chat.sendMessage, erro:', err);
        console.warn('DEBUG chat object:', JSON.stringify({
          id: chat?.id,
          isGroup: chat?.isGroup,
          name: (chat as any)?.name,
          lastMsg: (chat as any)?.lastMessage
        }));
        // continua para tentativa fallback
      }
    }
  }

  // fallback final: client.sendMessage direto com try/catch
  try {
    await client.sendMessage(message.from, text, { sendSeen: false });
    return true;
  } catch (err) {
    console.error('safeSendMessage: fallback client.sendMessage também falhou:', err);
    return false;
  }
}
 */

export const handleMessage = async (client: Client, message: Message) => {
  try {
    // Ignorar mensagens do sistema/broadcast
    if (message.from === 'status@broadcast') {
      console.warn('🚫 Ignorando mensagem do sistema/broadcast.');
      return;
    }

        // 📍 TRATAMENTO DE LOCALIZAÇÃO (ANTES DO NLP)
    if (message.type === 'location') {
      const chat = await message.getChat().catch(() => null);

      if (chat?.isGroup) return;

      await message.reply(
        '🙏 Obrigado! Recebemos sua localização.\nAguarde, seu pedido já está em preparo 🚀'
        , undefined, { sendSeen: false });

      return; // ⛔ IMPORTANTE: NÃO passa pelo NLP
    }

       // 🧹 Ignorar mensagens sem texto (áudio, imagem, etc.)
    if (!message.body || message.body.trim() === '') {
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

    if (chat?.isGroup) {
        console.log(`Mensagem ignorada de grupo: ${chat.name}`);
        return;
      }

    if (!chat) return;

    // Envia todas as respostas separadamente
    for (const resposta of responses) {
      const text = resposta?.trim();
      if (!text) continue;

      try {


        if (!chat) {
          console.warn('Chat não carregado no WhatsApp Web');
          return;
        }

        await chat.sendMessage(text, { sendSeen: false });
      } catch (err) {
        console.error('❌ Errro ao enviar a mensagem (chat.sendMessage):', err);
      }
    }
  } catch (err) {
    console.error('❌ Erro ao processar ou responder a mensagem:', err);
  }
};
