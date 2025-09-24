// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerByIdRepository } from "../../../infrastruture/repository/soccer/FindSoccerByIdRepository";
import { DeleteSoccerByAdminRepository } from "../../../infrastruture/repository/soccer/DeleteSoccerByAdminRepository";

// Importando usecase
import { DeleteSoccerByAdminUseCase } from "../../../application/usecases/soccer/delete/DeleteSoccerByAdminUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SoccerAccessDeniedDeleteError } from "../../../shared/errors/soccer-error/SoccerAccessDeniedError";
import { SoccerAccessDeniedError } from "../../../shared/errors/soccer-error/SoccerAccessDeniedError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";

// exportando controller
export class DeleteSoccerByAdminController {
  async handle(request: Request, response: Response) {
    // atributos
    const userId = request.user.id;
    const { id } = request.params;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerByIdRepository = new FindSoccerByIdRepository();
    const deleteSoccerByAdminRepository = new DeleteSoccerByAdminRepository();

    // instância da usecase
    const useCase = new DeleteSoccerByAdminUseCase(
      findUserByIdRepository,
      findSoccerByIdRepository,
      deleteSoccerByAdminRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ userId, id: id as string });

      return response.status(200).json({
        message: "A quadra foi deletada com sucesso!",
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de deletar a quadra
      if (err instanceof SoccerAccessDeniedDeleteError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão
      if (err instanceof SoccerAccessDeniedError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de quadra não encontrada
      if (err instanceof SoccerNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
