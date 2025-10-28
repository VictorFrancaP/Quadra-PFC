// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerOwnerRepository } from "../../../infrastruture/repository/soccer/FindSoccerOwnerRepository";
import { DecryptData } from "../../../shared/providers/aes/decrypt/DecryptData";

// Importando usecase
import { FindSoccerOwnerUseCase } from "../../../application/usecases/soccer/list/FindSoccerOwnerUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SoccerAccessDeniedViewError } from "../../../shared/errors/soccer-error/SoccerAccessDeniedError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";

// exportando controller
export class FindSoccerOwnerController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerOwnerRepository = new FindSoccerOwnerRepository();
    const decryptData = new DecryptData();

    // instância da usecase
    const useCase = new FindSoccerOwnerUseCase(
      findUserByIdRepository,
      findSoccerOwnerRepository,
      decryptData
    );

    // criando try/catch para capturar erros na execução
    try {
      const soccer = await useCase.execute({ userId });

      return response.status(200).json(soccer);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente
      if (err instanceof SoccerAccessDeniedViewError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de quadra não encontrada
      if (err instanceof SoccerNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
