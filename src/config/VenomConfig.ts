import * as venom from 'venom-bot';

export const startVenomClient = () => {
  return venom.create(
    'session-name', // Nome da sessão como primeiro argumento
    undefined, // Parâmetro opcional (QR Code)
    undefined, // Parâmetro opcional (statusFind)
    {
      headless: "new", // Executa sem abrir uma janela do navegador
      autoClose: 0, // Mantém o WhatsApp aberto mesmo após erro    
    }
    );
}; 