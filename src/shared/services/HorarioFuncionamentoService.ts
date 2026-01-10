// src/shared/services/HorarioFuncionamentoService.ts

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'America/Sao_Paulo';

interface HorarioFuncionamento {
  diasSemana: number[]; // 0 = domingo, 6 = sábado
  abertura: string; // '18:00'
  fechamento: string; // '23:30'
}

export class HorarioFuncionamentoService {

  // 👉 DEFINIÇÃO ATUAL (HARDCODED)
  private static horarios: HorarioFuncionamento[] = [
    {
      diasSemana: [2, 3, 4,5, 6, 0], // Terça a Domingo
      abertura: '14:00',
      fechamento: '22:00',
    },
  ];

  static estaAberto(): boolean {
    const agora = dayjs().tz(TIMEZONE);
    const diaSemana = agora.day(); // 0 domingo

    for (const horario of this.horarios) {
      if (!horario.diasSemana.includes(diaSemana)) continue;

      const abertura = dayjs.tz(
        `${agora.format('YYYY-MM-DD')} ${horario.abertura}`,
        TIMEZONE
      );

      let fechamento = dayjs.tz(
        `${agora.format('YYYY-MM-DD')} ${horario.fechamento}`,
        TIMEZONE
      );

      // 👉 Caso o fechamento vire o dia (ex: 18:00 → 01:00)
      if (fechamento.isBefore(abertura)) {
        fechamento = fechamento.add(1, 'day');
      }

      if (agora.isAfter(abertura) && agora.isBefore(fechamento)) {
        return true;
      }
    }

    return false;
  }

  static mensagemForaHorario(): string {
    return (
      `❌ *Estamos fechados no momento*\n\n` +
      `🕒 Funcionamos *terça a domingo*, das *14h às 22h*\n\n` +
      `📲 Você pode conferir nosso cardápio enquanto isso em https://empireofk.com.br/card 😊`
    );
  }
}
