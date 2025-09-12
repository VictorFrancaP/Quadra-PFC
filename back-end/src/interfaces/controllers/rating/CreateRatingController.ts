// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { CreateRatingRepository } from "../../../infrastruture/repository/rating/CreateRatingRepository";

// Importando usecase
import { CreateRatingUseCase } from "../../../application/usecases/rating/create/CreateRatingUseCase";

// exportando controller
export class CreateRatingController {
  async handle(request: Request, response: Response) {
    // atributos
    const userId = request.user.id;
    const { rating, comments } = request.body;
    const { soccerId, ratedUserId } = request.params;

    // instâncias das interfaces implementadas
    const createRatingRepository = new CreateRatingRepository();

    // instância usecase
    const useCase = new CreateRatingUseCase(createRatingRepository);

    // criando try/catch para capturar erros na execução
    try {
      const ratings = await useCase.execute({
        rating,
        userId,
        comments,
        soccerId,
        ratedUserId,
      });

      return response.status(200).json(ratings);
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
