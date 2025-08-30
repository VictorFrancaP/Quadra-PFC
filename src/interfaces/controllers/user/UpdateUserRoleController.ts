// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { UpdateUserRepository } from "../../../infrastruture/repository/user/UpdateUserRepository";

// Importando usecase
import { UpdateUserRoleUseCase } from "../../../application/usecases/user/update/UpdateUserRoleUseCase";

// exportando controller
export class UpdateUserRoleController {
  async handle(request: Request, response: Response) {
    // atributos
    const userId = request.user.id;
    const { id } = request.params;
    const { newRole } = request.body;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const updateUserRepository = new UpdateUserRepository();

    // instância da usecase
    const useCase = new UpdateUserRoleUseCase(
      findUserByIdRepository,
      updateUserRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ userId, id: id as string, newRole });

      return response.status(200).json({
        message: "Usuário atualizado com sucesso!",
      });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
