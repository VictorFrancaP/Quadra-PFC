// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccersRepository } from "../../../infrastruture/repository/soccer/FindSoccersRepository";
import { OpenRouteProvider } from "../../../shared/providers/open-route-service/OpenRouteProvider";

// Importando usecase
import { FindNearbySoccerUseCase } from "../../../application/usecases/soccer/list/FindNearbySoccerUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserLatLgnNotFoundError } from "../../../shared/errors/user-error/AddUserProfileInfoError";
import { SoccersNotFoundError } from "../../../shared/errors/soccer-error/SoccersNotFoundError";

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
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de usuário sem latitude e longitude
      if (err instanceof UserLatLgnNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de nenhuma quadra encontrada na base de dados - nulo
      if (err instanceof SoccersNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
