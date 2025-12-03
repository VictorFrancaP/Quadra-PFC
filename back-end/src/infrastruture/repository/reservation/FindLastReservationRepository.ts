// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindLastReservationRepositories } from "../../../domain/repositories/reservation/IFindLastReservationRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindLastReservationRepository
  implements IFindLastReservationRepositories
{
  async findLastReservationEndTime(userId: string): Promise<Date | null> {
    // procurando ultima reserva realizada pelo usuário
    const reservation = await prismaClient.reservation.findFirst({
      where: {
        userId,
        statusPayment: "CONFIRMED",
        endTime: { lt: new Date() },
      },
      orderBy: { endTime: "desc" },
      select: {
        endTime: true,
      },
    });

    // retornando data de termino da reserva ou nulo
    return reservation?.endTime || null;
  }
}
