// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindUserOrderRepository } from "../../../infrastruture/repository/order/FindUserOrderRepository";
import { UpdateUserRepository } from "../../../infrastruture/repository/user/UpdateUserRepository";

// Importando usecase
import { UpdateUserRoleUseCase } from "../../../application/usecases/user/update/UpdateUserRoleUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedRoleUpdateError } from "../../../shared/errors/user-error/UserAccessDeniedError";
import { UserAccessDeniedRoleSameError } from "../../../shared/errors/user-error/UserAccessDeniedError";

// exportando controller
export class UpdateUserRoleController {
  async handle(request: Request, response: Response) {
    // atributos
    const userId = request.user.id;
    const { id } = request.params;
    const { newRole } = request.body;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findUserOrderRepository = new FindUserOrderRepository();
    const updateUserRepository = new UpdateUserRepository();

    // instância da usecase
    const useCase = new UpdateUserRoleUseCase(
      findUserByIdRepository,
      findUserOrderRepository,
      updateUserRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ userId, id: id as string, newRole });

      return response.status(200).json({
        message: "Usuário atualizado com sucesso!",
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente para alteração de role do usuário
      if (err instanceof UserAccessDeniedRoleUpdateError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de mesma permissão para o usuário
      if (err instanceof UserAccessDeniedRoleSameError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
