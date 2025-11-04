// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerOwnerRepository } from "../../../infrastruture/repository/soccer/FindSoccerOwnerRepository";
import { FindReservationSoccerRepository } from "../../../infrastruture/repository/reservation/FindReservationSoccerRepository";
import { DayJsProvider } from "../../../shared/providers/dayjs/DayJsProvider";

// Importando usecase
import { ReportReservationUseCase } from "../../../application/usecases/reservation/ReportReservationUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedRoleSameError } from "../../../shared/errors/user-error/UserAccessDeniedError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";
import { ReservationsNotFoundError } from "../../../shared/errors/reservation-error/ReservationNotFoundError";

// exportando controller
export class ReportReservationController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerOwnerRepository = new FindSoccerOwnerRepository();
    const findReservationSoccerRepository =
      new FindReservationSoccerRepository();
    const dayJsProvider = new DayJsProvider();

    // instância usecase
    const useCase = new ReportReservationUseCase(
      findUserByIdRepository,
      findSoccerOwnerRepository,
      findReservationSoccerRepository,
      dayJsProvider
    );

    // criando try/catch para capturar erros na execução
    try {
      const report = await useCase.execute({ userId });

      return response.status(200).json(report);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente
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

      //   erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
