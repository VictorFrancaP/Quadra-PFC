// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSupportsRepository } from "../../../infrastruture/repository/support/FindSupportsRepository";

// Importando usecase
import { FindSupportsUseCase } from "../../../application/usecases/support/list/FindSupportsUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedError } from "../../../shared/errors/user-error/UserAccessDeniedError";

// exportando controller
export class FindSupportsController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSupportsRepository = new FindSupportsRepository();

    // instância da usecase
    const useCase = new FindSupportsUseCase(
      findUserByIdRepository,
      findSupportsRepository
    );

    // criando try/catch para a captura de erros na execução
    try {
      const supports = await useCase.execute({ userId });

      return response.status(200).json(supports);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente
      if (err instanceof UserAccessDeniedError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json({
        message: err.message,
      });
    }
  }
}
