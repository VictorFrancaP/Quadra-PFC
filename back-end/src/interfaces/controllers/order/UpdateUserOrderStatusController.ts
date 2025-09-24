// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindOrderByIdRepository } from "../../../infrastruture/repository/order/FindOrderByIdRepository";
import { UpdateUserOrderRepository } from "../../../infrastruture/repository/order/UpdateUserOrderRepository";

// Importando usecase
import { UpdateUserOrderStatusUseCase } from "../../../application/usecases/order/update/UpdateUserOrderStatusUseCase";

// Importando error personalizado
import { UserOrderNotFoundError } from "../../../shared/errors/user-error/UserOrderError";
import { OrderErrorUpdated } from "../../../shared/errors/user-error/UserOrderError";
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedUpdateError } from "../../../shared/errors/user-error/UserAccessDeniedError";

// exportando controller
export class UpdateUserOrderStatusController {
  async handle(request: Request, response: Response) {
    // atributos
    const userId = request.user.id;
    const { id } = request.params;
    const { newStatus } = request.body;

    // instânciando interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findOrderByIdRepository = new FindOrderByIdRepository();
    const updateUserOrderRepository = new UpdateUserOrderRepository();

    // instância da usecase
    const useCase = new UpdateUserOrderStatusUseCase(
      findUserByIdRepository,
      findOrderByIdRepository,
      updateUserOrderRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ userId, id: id as string, newStatus });

      return response.status(200).json({
        message: "Solicitação alterada com sucesso!",
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de solicitação de usuário não encontrada
      if (err instanceof UserOrderNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de atualizar a solicitação
      if (err instanceof OrderErrorUpdated) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente para atualizar solicitação do usuário
      if (err instanceof UserAccessDeniedUpdateError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
