// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerByIdRepository } from "../../../infrastruture/repository/soccer/FindSoccerByIdRepository";
import { FindReservationRepository } from "../../../infrastruture/repository/reservation/FindReservationRepository";
import { DayJsProvider } from "../../../shared/providers/dayjs/DayJsProvider";
import { PaymentProvider } from "../../../shared/providers/payment/provider/PaymentProvider";
import { UpdateReservationRepository } from "../../../infrastruture/repository/reservation/UpdateReservationRepository";
import { CreateReservationRepository } from "../../../infrastruture/repository/reservation/CreateReservationRepository";

// Importando usecase
import { CreateReservationUseCase } from "../../../application/usecases/reservation/CreateReservationUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";
import { SoccerNotActiveError } from "../../../shared/errors/soccer-error/SoccerNotActiveError";
import { OwnerReservationError } from "../../../shared/errors/reservation-error/OwnerReservationError";
import { ReservationDurationError } from "../../../shared/errors/reservation-error/ReservationDurationError";
import { ReservationAlreadyExists } from "../../../shared/errors/reservation-error/ReservationAlreadyExistsError";

// exportando controller
export class CreateReservationController {
  async handle(request: Request, response: Response) {
    // verificando usuário logado
    const userId = request.user.id;
    const { soccerId } = request.params;
    const { startTime, duration } = request.body;

    // convertendo string para date
    const startTimeDate = new Date(startTime);

    // instânciando interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerByIdRepository = new FindSoccerByIdRepository();
    const findReservationRepository = new FindReservationRepository();
    const dayJsProvider = new DayJsProvider();
    const paymentProvider = new PaymentProvider();
    const updateReservationRepository = new UpdateReservationRepository();
    const createReservationRepository = new CreateReservationRepository();

    // instãnciando usecase
    const useCase = new CreateReservationUseCase(
      findUserByIdRepository,
      findSoccerByIdRepository,
      findReservationRepository,
      dayJsProvider,
      paymentProvider,
      updateReservationRepository,
      createReservationRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const res = await useCase.execute({
        userId,
        soccerId: soccerId as string,
        startTime: startTimeDate,
        duration,
      });

      return response.status(201).json({
        message: "Sua reserva foi criada com sucesso!",
        reservationId: res.reservation.id,
        paymentLink: res.initPoint,
        expiredIn: res.reservation.expiredIn,
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de quadra não encontrada na base de dados
      if (err instanceof SoccerNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de quadra não ativa
      if (err instanceof SoccerNotActiveError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de proprietário da propria quadra, tentando reservar
      if (err instanceof OwnerReservationError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de tempo limite atingido na duração da reserva
      if (err instanceof ReservationDurationError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de reserva já existente no horario
      if (err instanceof ReservationAlreadyExists) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
