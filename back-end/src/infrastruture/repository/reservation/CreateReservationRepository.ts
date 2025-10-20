// Importando interface a ser implementada nesta classe e prismaClient para a manipulação de dados
import { ICreateReservationRepositories } from "../../../domain/repositories/reservation/ICreateReservationRepositories";
import { Reservation } from "../../../domain/entities/Reservation";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class CreateReservationRepository
  implements ICreateReservationRepositories
{
  async createReservation(reservation: Reservation): Promise<Reservation> {
    // criando reserva no banco de dados
    const createdReservation = await prismaClient.reservation.create({
      data: {
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        statusPayment: reservation.statusPayment,
        statusPayout: reservation.statusPayout,
        expiredIn: reservation.expiredIn,
        totalPrice: reservation.totalPrice,
        duration: reservation.duration,
        soccerId: reservation.soccerId,
        userId: reservation.userId,
        paymentTransactionId: null,
        paymentReceivedAt: null,
        systemFeeAmount: null,
        netPayoutAmount: null,
        payoutDate: null,
        payoutTransactionId: null,
      },
    });

    // retornando dados criados em uma nova entidade
    return new Reservation(
      createdReservation.startTime,
      createdReservation.endTime,
      createdReservation.statusPayment,
      createdReservation.statusPayout,
      createdReservation.expiredIn,
      createdReservation.totalPrice,
      createdReservation.duration,
      createdReservation.soccerId,
      createdReservation.userId,
      createdReservation.paymentTransactionId,
      createdReservation.paymentReceivedAt,
      createdReservation.systemFeeAmount,
      createdReservation.netPayoutAmount,
      createdReservation.payoutDate,
      createdReservation.payoutTransactionId,
      createdReservation.id
    );
  }
}
