// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerOwnerRepository } from "../../../infrastruture/repository/soccer/FindSoccerOwnerRepository";
import { FindReservationSoccerRepository } from "../../../infrastruture/repository/reservation/FindReservationSoccerRepository";

// Importando usecase
import { FindReservationSoccerUseCase } from "../../../application/usecases/reservation/FindReservationSoccerUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedRoleSameError } from "../../../shared/errors/user-error/UserAccessDeniedError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";
import { ReservationsNotFoundError } from "../../../shared/errors/reservation-error/ReservationNotFoundError";

// exportando controller
export class FindReservationSoccerController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerOwnerRepository = new FindSoccerOwnerRepository();
    const findReservationSoccerRepository =
      new FindReservationSoccerRepository();

    // instância da usecase
    const useCase = new FindReservationSoccerUseCase(
      findUserByIdRepository,
      findSoccerOwnerRepository,
      findReservationSoccerRepository
    );

    try {
      const reservations = await useCase.execute({ userId });

      return response.status(200).json(reservations);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente de usuário
      if (err instanceof UserAccessDeniedRoleSameError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de quadra não encontrada
      if (err instanceof SoccerNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de reservas não encontradas
      if (err instanceof ReservationsNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}