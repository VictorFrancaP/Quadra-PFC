// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindUserSupportRepository } from "../../../infrastruture/repository/support/FindUserSupportRepository";

// Importando usecase
import { FindSupportUserUseCase } from "../../../application/usecases/support/list/FindSupportUserUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SupportNotFoundError } from "../../../shared/errors/support-error/SupportNotFoundError";

// exportando controller
export class FindSupportUserController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // instâncias das interface implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findUserSupportRepository = new FindUserSupportRepository();

    // instância da usecase
    const useCase = new FindSupportUserUseCase(
      findUserByIdRepository,
      findUserSupportRepository
    );

    // criando try/catch para a captura de erros na execução
    try {
      const support = await useCase.execute({ userId });

      return response.status(200).json(support);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de suporte não encontrado
      if (err instanceof SupportNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json({
        message: err.message,
      });
    }
  }
}
