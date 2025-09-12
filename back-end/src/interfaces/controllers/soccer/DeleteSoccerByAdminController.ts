// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerByIdRepository } from "../../../infrastruture/repository/soccer/FindSoccerByIdRepository";
import { DeleteSoccerByAdminRepository } from "../../../infrastruture/repository/soccer/DeleteSoccerByAdminRepository";

// Importando usecase
import { DeleteSoccerByAdminUseCase } from "../../../application/usecases/soccer/delete/DeleteSoccerByAdminUseCase";

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
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
