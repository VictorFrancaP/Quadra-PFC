// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserRatingsRepository } from "../../../infrastruture/repository/rating/FindUserRatingsRepository";

// Importando usecase
import { FindUserAverageUseCase } from "../../../application/usecases/rating/list/FindUserAverageUseCase";

// exportando controller
export class FindUserAverageController {
  async handle(request: Request, response: Response) {
    // atributos
    const { ratedUserId } = request.params;

    // instâncias das interfaces implementadas
    const findUserRatingsRepository = new FindUserRatingsRepository();

    // instância da usecase
    const useCase = new FindUserAverageUseCase(findUserRatingsRepository);

    // criando try/catch para capturar erros na execução
    try {
      const average = await useCase.execute({ userId: ratedUserId! });

      return response.status(200).json({ average });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
