// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindReservationSoccerRepositories } from "../../../domain/repositories/reservation/IFindReservationSoccerRepositories";
import { Reservation } from "../../../domain/entities/Reservation";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindReservationSoccerRepository
  implements IFindReservationSoccerRepositories
{
  async findSoccerReservation(soccerId: string): Promise<Reservation[] | null> {
    // procurando reservas efetuadas nesta quadra
    const soccerReservations = await prismaClient.reservation.findMany({
      where: { soccerId },
      orderBy: {
        startTime: "asc",
      },
    });

    // caso não encontre nada, retorna nulo
    if (!soccerReservations) {
      return null;
    }

    // retornando dados encontrados
    return soccerReservations.map(
      (reservation) =>
        new Reservation(
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
        )
    );
  }
}
