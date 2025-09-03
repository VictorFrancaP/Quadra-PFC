// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { DeleteUserRepository } from "../../../infrastruture/repository/user/DeleteUserRepository";

// Importando usecase
import { DeleteUserUseCase } from "../../../application/usecases/user/delete/DeleteUserUseCase";

// exportando controller
export class DeleteUserController {
  async handle(request: Request, response: Response) {
    // pegando o id do usuário logado
    const userId = request.user.id;

    // instânciando interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const deleteUserRepository = new DeleteUserRepository();

    // instância da usecase
    const useCase = new DeleteUserUseCase(
      findUserByIdRepository,
      deleteUserRepository
    );

    // criando try/catch para capturar erros de execução
    try {
      await useCase.execute({ userId });

      return response.status(200).json({
        message: "Sua conta foi deletado com sucesso!",
      });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
