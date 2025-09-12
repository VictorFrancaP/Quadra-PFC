// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccersRepository } from "../../../infrastruture/repository/soccer/FindSoccersRepository";
import { OpenRouteProvider } from "../../../shared/providers/open-route-service/OpenRouteProvider";

// Importando usecase
import { FindNearbySoccerUseCase } from "../../../application/usecases/soccer/list/FindNearbySoccerUseCase";

// exportando controller
export class FindNearbySoccerController {
  async handle(request: Request, response: Response) {
    // atributos
    const userId = request.user.id;
    const { distanciaMaximaKm } = request.body;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccersRepository = new FindSoccersRepository();
    const openRouteProvider = new OpenRouteProvider();

    // instância da usecase
    const useCase = new FindNearbySoccerUseCase(
      findUserByIdRepository,
      findSoccersRepository,
      openRouteProvider
    );

    // criando try/catch para a captura de erros na execução
    try {
      const result = await useCase.execute({ userId, distanciaMaximaKm });

      return response.status(200).json(result);
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
