// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { DeleteSoccerByOwnerRepository } from "../../../infrastruture/repository/soccer/DeleteSoccerByOwnerRepository";

// Importando usecase
import { DeleteSoccerByOwnerUseCase } from "../../../application/usecases/soccer/delete/DeleteSoccerByOwnerUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SoccerAccessDeniedDeleteError } from "../../../shared/errors/soccer-error/SoccerAccessDeniedError";

// exportando controller
export class DeleteSoccerByOwnerController {
  async handle(request: Request, response: Response) {
    // atributos
    const userId = request.user.id;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const deleteSoccerByOwnerRepository = new DeleteSoccerByOwnerRepository();

    // instância da usecase
    const useCase = new DeleteSoccerByOwnerUseCase(
      findUserByIdRepository,
      deleteSoccerByOwnerRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ userId });

      return response.status(200).json({
        message: "Sua quadra foi deletada com sucesso!",
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente para deletar a quadra
      if (err instanceof SoccerAccessDeniedDeleteError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
