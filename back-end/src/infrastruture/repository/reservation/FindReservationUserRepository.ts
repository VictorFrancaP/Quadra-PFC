// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindReservationUserRepositories } from "../../../domain/repositories/reservation/IFindReservationUserRepositories";
import { Reservation } from "../../../domain/entities/Reservation";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindReservationUserRepository
  implements IFindReservationUserRepositories
{
  async findUserReservation(userId: string): Promise<Reservation[] | null> {
    // procurando reservas do usuário
    const userReservations = await prismaClient.reservation.findMany({
      where: { userId },
      orderBy: {
        startTime: "desc",
      },
    });

    // caso não encontre nada, retorna nulo
    if (!userReservations) {
      return null;
    }

    // retornando dados encontrados
    return userReservations.map(
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
