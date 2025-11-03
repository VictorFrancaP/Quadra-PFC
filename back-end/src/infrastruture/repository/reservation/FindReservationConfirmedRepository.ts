// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IFindReservationConfirmedRepositories } from "../../../domain/repositories/reservation/IFindReservationConfirmedRepositories";
import { Reservation } from "../../../domain/entities/Reservation";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindReservationConfirmedRepository
  implements IFindReservationConfirmedRepositories
{
  async findReservationConfirmed(
    userId: string,
    soccerId: string
  ): Promise<Reservation | null> {
    // procurando reserva do usuário
    const reservation = await prismaClient.reservation.findFirst({
      where: {
        userId,
        soccerId,
        statusPayment: {
          in: ["CONFIRMED"],
        },
      },
    });

    // caso não encontre, retorna nulo
    if (!reservation) {
      return null;
    }

    // retornando dados encontrados
    return new Reservation(
      reservation.startTime,
      reservation.endTime,
      reservation.statusPayment,
      reservation.statusPayout,
      reservation.expiredIn,
      reservation.totalPrice,
      reservation.duration,
      reservation.soccerId,
      reservation.userId,
      reservation.soccerName,
      reservation.userName,
      reservation.userEmail,
      reservation.paymentTransactionId,
      reservation.paymentReceivedAt,
      reservation.systemFeeAmount,
      reservation.netPayoutAmount,
      reservation.payoutDate,
      reservation.payoutTransactionId,
      reservation.id
    );
  }
}
