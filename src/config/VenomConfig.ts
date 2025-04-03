import venom from 'venom-bot';

export const startVenomClient = () => {
  return venom.create({
    session: 'session-name',
    multidevice: true, // Habilita multiplos dispositivos
  });
}; 