// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindSoccerRatingRepository } from "../../../infrastruture/repository/rating/FindSoccerRatingRepository";

// Importando usecase
import { FindSoccerAverageUseCase } from "../../../application/usecases/rating/list/FindSoccerAverageUseCase";

// exportando controller
export class FindSoccerAverageController {
  async handle(request: Request, response: Response) {
    // atributos
    const { soccerId } = request.params;

    // instâncias das interfaces implementadas
    const findSoccerRatingRepository = new FindSoccerRatingRepository();

    // instância da usecase
    const useCase = new FindSoccerAverageUseCase(findSoccerRatingRepository);

    // criando try/catch para capturar erros na execução
    try {
      const average = await useCase.execute({ soccerId: soccerId! });

      return response.status(200).json({ average });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
