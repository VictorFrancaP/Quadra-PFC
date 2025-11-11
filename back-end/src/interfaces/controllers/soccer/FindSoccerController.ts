// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerByIdRepository } from "../../../infrastruture/repository/soccer/FindSoccerByIdRepository";
import { FindSoccerRatingRepository } from "../../../infrastruture/repository/rating/FindSoccerRatingRepository";
import { DecryptData } from "../../../shared/providers/aes/decrypt/DecryptData";

// Importando usecase
import { FindSoccerUseCase } from "../../../application/usecases/soccer/list/FindSoccerUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";
import { FindSoccerRatingsRepository } from "../../../infrastruture/repository/rating/FindSoccerRatingsRepository";
import { FindSoccerAverageUseCase } from "../../../application/usecases/rating/list/FindSoccerAverageUseCase";

// exportando controller
export class FindSoccerController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // id da quadra
    const { id } = request.params;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerByIdRepository = new FindSoccerByIdRepository();
    const decryptData = new DecryptData();
    const findSoccerRatingsRepository = new FindSoccerRatingsRepository();
    const findSoccerRatingRepository = new FindSoccerRatingRepository();
    const findSoccerAverageUseCase = new FindSoccerAverageUseCase(
      findSoccerRatingsRepository,
      findSoccerRatingRepository
    );

    // instância da usecase
    const useCase = new FindSoccerUseCase(
      findUserByIdRepository,
      findSoccerByIdRepository,
      decryptData,
      findSoccerAverageUseCase,
      findSoccerRatingsRepository
    );

    // criando try/catch para capturar
    try {
      const soccer = await useCase.execute({
        userId,
        soccerId: id as string,
      });

      return response.status(200).json(soccer);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não exista
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de quadra não existe
      if (err instanceof SoccerNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
