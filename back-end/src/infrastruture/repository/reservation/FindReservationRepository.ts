// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindReservationRepositories } from "../../../domain/repositories/reservation/IFindReservationRepositories";
import { Reservation } from "../../../domain/entities/Reservation";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindReservationRepository implements IFindReservationRepositories {
  async findReservation(
    soccerId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Reservation | null> {
    // procurando reserva no banco de dados
    const reservation = await prismaClient.reservation.findFirst({
      where: {
        soccerId,
        AND: [
          {
            startTime: {
              lt: endTime,
            },
            endTime: {
              gt: startTime,
            },
          },
        ],
        statusPayment: {
          in: ["PENDING_PAYMENT", "CONFIRMED"],
        },
      },
    });

    // caso não exista, retorna um erro
    if (!reservation) {
      return null;
    }

    // retornando dados encontrados em uma nova entidade
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
