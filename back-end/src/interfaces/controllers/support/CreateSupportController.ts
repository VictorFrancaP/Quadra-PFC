// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindUserSupportRepository } from "../../../infrastruture/repository/support/FindUserSupportRepository";
import { CreateSupportRepository } from "../../../infrastruture/repository/support/CreateSupportRepository";

// Importando usecase
import { CreateSupportUseCase } from "../../../application/usecases/support/create/CreateSupportUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SupportFoundError } from "../../../shared/errors/support-error/SupportFoundError";

// exportando controller
export class CreateSupportController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // atributos
    const { subject, message } = request.body;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findUserSupportRepository = new FindUserSupportRepository();
    const createSupportRepository = new CreateSupportRepository();

    // instância da usecase
    const useCase = new CreateSupportUseCase(
      findUserByIdRepository,
      findUserSupportRepository,
      createSupportRepository
    );

    // criando try/catch para a captura de erros na execução
    try {
      await useCase.execute({ userId, subject, message });

      return response
        .status(200)
        .json({ message: "Seu chamado foi criado com sucesso!" });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de suporte encontrado
      if (err instanceof SupportFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json({
        message: err.message,
      });
    }
  }
}
