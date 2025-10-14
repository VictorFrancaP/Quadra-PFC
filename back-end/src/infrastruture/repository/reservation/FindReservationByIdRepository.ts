// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindReservationByIdRepositories } from "../../../domain/repositories/reservation/IFindReservationByIdRepositories";
import { Reservation } from "../../../domain/entities/Reservation";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindReservationByIdRepository
  implements IFindReservationByIdRepositories
{
  async findReservationById(id: string): Promise<Reservation | null> {
    // procurando reserva no banco de dados
    const reservation = await prismaClient.reservation.findFirst({
      where: { id },
    });

    // caso não encontre nada, retorna nulo
    if (!reservation) {
      return null;
    }

    // retornando dados encontrados
    return new Reservation(
      reservation.startTime,
      reservation.endTime,
      reservation.statusPayment,
      reservation.expiredIn,
      reservation.totalPrice,
      reservation.duration,
      reservation.soccerId,
      reservation.userId,
      reservation.paymentTransactionId,
      reservation.paymentReceivedAt,
      reservation.id
    );
  }
}
