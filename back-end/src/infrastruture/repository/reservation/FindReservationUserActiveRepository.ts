// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindReservationUserActiveRepositories } from "../../../domain/repositories/reservation/IFindReservationUserActiveRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindReservationUserActiveRepository
  implements IFindReservationUserActiveRepositories
{
  async findReservationActive(userId: string): Promise<boolean> {
    // verificando se existe uma reserva
    const activeReservation = await prismaClient.reservation.findFirst({
      where: {
        userId,
        endTime: {
          gt: new Date(),
        },
        statusPayment: {
          in: ["CONFIRMED"],
        },
      },
    });

    // retornando true se encontrar uma reserva vigente
    return !!activeReservation;
  }
}
