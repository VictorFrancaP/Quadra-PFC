// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IUpdateReservationRepositories } from "../../../domain/repositories/reservation/IUpdateReservationRepositories";
import { Reservation } from "../../../domain/entities/Reservation";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class UpdateReservationRepository
  implements IUpdateReservationRepositories
{
  async updateReservation(reservation: Reservation): Promise<void> {
    // chamando metodo de update do prismaClient para a atualização no banco de dados
    await prismaClient.reservation.update({
      where: { id: reservation.id },
      data: {
        statusPayment: reservation.statusPayment,
        paymentTransactionId: reservation.paymentTransactionId,
        paymentReceivedAt: reservation.paymentReceivedAt,
      },
    });
  }
}
