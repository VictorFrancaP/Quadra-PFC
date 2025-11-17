// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSupportByIdRepository } from "../../../infrastruture/repository/support/FindSupportByIdRepository";
import { UpdateSupportRepository } from "../../../infrastruture/repository/support/UpdateSupportRepository";

// Importando usecase
import { UpdateSupportUseCase } from "../../../application/usecases/support/update/UpdateSupportUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedError } from "../../../shared/errors/user-error/UserAccessDeniedError";
import { SupportNotFoundError } from "../../../shared/errors/support-error/SupportNotFoundError";

// exportando controller
export class UpdateSupportController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // id do chamado
    const { id } = request.params;

    // novo status
    const { newStatus } = request.body;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSupportByIdRepository = new FindSupportByIdRepository();
    const updateSupportRepository = new UpdateSupportRepository();

    // instância da usecase
    const useCase = new UpdateSupportUseCase(
      findUserByIdRepository,
      findSupportByIdRepository,
      updateSupportRepository
    );

    // criando try/catch para a captura de erros na execução
    try {
      await useCase.execute({ userId, id: id as string, newStatus });

      return response
        .status(200)
        .json({ message: "Status do chamado atualizado com sucesso!" });
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
