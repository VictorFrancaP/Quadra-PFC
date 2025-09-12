// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { DeleteSoccerByOwnerRepository } from "../../../infrastruture/repository/soccer/DeleteSoccerByOwnerRepository";

// Importando usecase
import { DeleteSoccerByOwnerUseCase } from "../../../application/usecases/soccer/delete/DeleteSoccerByOwnerUseCase";

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
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
