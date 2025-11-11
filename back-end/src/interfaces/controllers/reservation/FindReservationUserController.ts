// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindReservationUserRepository } from "../../../infrastruture/repository/reservation/FindReservationUserRepository";

// Importando usecase
import { FindReservationUserUseCase } from "../../../application/usecases/reservation/FindReservationUserUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { ReservationNotFoundError } from "../../../shared/errors/reservation-error/ReservationNotFoundError";
import { FindSoccerRatingRepository } from "../../../infrastruture/repository/rating/FindSoccerRatingRepository";

// exportando controller
export class FindReservationUserController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findReservationUserRepository = new FindReservationUserRepository();
    const findSoccerRatingRepository = new FindSoccerRatingRepository();

    // instância da usecase
    const useCase = new FindReservationUserUseCase(
      findUserByIdRepository,
      findReservationUserRepository,
      findSoccerRatingRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const reservations = await useCase.execute({ userId });

      return response.status(200).json(reservations);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de reserva não encontrada
      if (err instanceof ReservationNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
