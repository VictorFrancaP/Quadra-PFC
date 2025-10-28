// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindReservationByIdRepository } from "../../../infrastruture/repository/reservation/FindReservationByIdRepository";
import { DayJsProvider } from "../../../shared/providers/dayjs/DayJsProvider";
import { PaymentProvider } from "../../../shared/providers/payment/provider/PaymentProvider";
import { UpdateReservationRepository } from "../../../infrastruture/repository/reservation/UpdateReservationRepository";

// Importando usecase
import { CancelReservationUseCase } from "../../../application/usecases/reservation/CancelReservationUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { ReservationNotFoundError } from "../../../shared/errors/reservation-error/ReservationNotFoundError";
import { ReservationAccessDeniedError } from "../../../shared/errors/reservation-error/ReservationAccessDeniedError";
import { ReservationCancelledError } from "../../../shared/errors/reservation-error/ReservationCancelledError";
import { ReservationTransactionError } from "../../../shared/errors/reservation-error/ReservationTransactionError";
import { ReservationRefundError } from "../../../shared/errors/reservation-error/ReservationRefundError";
import { OwnerReservationOtherError } from "../../../shared/errors/reservation-error/OwnerReservationError";

// exportando controller
export class CancelReservationController {
  async handle(request: Request, response: Response) {
    // pegando usuário logado
    const userId = request.user.id;

    // pegando id da reserva
    const { id: reservationId } = request.params;

    // instânciando interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findReservationByIdRepository = new FindReservationByIdRepository();
    const dayJsProvider = new DayJsProvider();
    const paymentProvider = new PaymentProvider();
    const updateReservationRepository = new UpdateReservationRepository();

    // instância da usecase
    const useCase = new CancelReservationUseCase(
      findUserByIdRepository,
      findReservationByIdRepository,
      dayJsProvider,
      paymentProvider,
      updateReservationRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const res = await useCase.execute({
        userId,
        reservationId: reservationId as string,
      });

      return response.status(200).json({
        message: res.message,
        status: res.status,
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de caso o usuário não exista
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de usuário é proprietário
      if (err instanceof OwnerReservationOtherError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de reserva não encontrada
      if (err instanceof ReservationNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente para cancelar reserva
      if (err instanceof ReservationAccessDeniedError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de reserva já foi cancelada
      if (err instanceof ReservationCancelledError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de id da transação não encontrado
      if (err instanceof ReservationTransactionError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de falha no reembolso ao usuário
      if (err instanceof ReservationRefundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
