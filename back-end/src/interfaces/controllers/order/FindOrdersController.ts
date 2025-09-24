// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindOrdersRepository } from "../../../infrastruture/repository/order/FindOrdersRepository";
import { DecryptData } from "../../../shared/providers/aes/decrypt/DecryptData";

// Importando usecase
import { FindOrdersUseCase } from "../../../application/usecases/order/list/FindOrdersUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UsersAccessDeniedError } from "../../../shared/errors/user-error/UserAccessDeniedError";
import { UsersOrdersNotFoundError } from "../../../shared/errors/user-error/UserOrderError";

// exportando controller
export class FindOrdersController {
  async handle(request: Request, response: Response) {
    // dados a serem passados
    const userId = request.user.id;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findOrdersRepository = new FindOrdersRepository();
    const decryptData = new DecryptData();

    // instância da usecase
    const useCase = new FindOrdersUseCase(
      findUserByIdRepository,
      findOrdersRepository,
      decryptData
    );

    // criando try/catch para capturar os erros na execução
    try {
      const orders = await useCase.execute({ userId });

      return response.status(200).json({ orders });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente para visualizar as solicitações
      if (err instanceof UsersAccessDeniedError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de nenhuma solicitação encontrada na base de dados
      if (err instanceof UsersOrdersNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
