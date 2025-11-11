// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerByIdRepository } from "../../../infrastruture/repository/soccer/FindSoccerByIdRepository";
import { FindRatingsSoccerRepository } from "../../../infrastruture/repository/rating/FindRatingsSoccerRepository";

// Importando usecase
import { FindRatingsSoccerUseCase } from "../../../application/usecases/rating/list/FindRatingsSoccerUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";

// exportando controller
export class FindRatingsSoccerController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // quadra
    const { soccerId } = request.params;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerByIdRepository = new FindSoccerByIdRepository();
    const findRatingsSoccerRepository = new FindRatingsSoccerRepository();

    // instância da usecase
    const useCase = new FindRatingsSoccerUseCase(
      findUserByIdRepository,
      findSoccerByIdRepository,
      findRatingsSoccerRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const ratings = await useCase.execute({
        userId,
        soccerId: soccerId as string,
      });

      return response.status(200).json(ratings);
    } catch (err: any) {
        // tratando erros de forma separada

        // erro de usuário não encontrado
        if(err instanceof UserNotFoundError) {
            return response.status(err.statusCode).json(err.message);
        }

        // erro de quadra não encontrada
        if(err instanceof SoccerNotFoundError) {
            return response.status(err.statusCode).json(err.message);
        }

        // erro desconhecido
        return response.status(500).json(err.message);
    }
  }
}
