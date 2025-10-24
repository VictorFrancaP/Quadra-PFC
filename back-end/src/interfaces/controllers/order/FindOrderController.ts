// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindUserOrderRepository } from "../../../infrastruture/repository/order/FindUserOrderRepository";

// Importando usecase
import { FindOrderUseCase } from "../../../application/usecases/order/list/FindOrderUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserOrderNotFoundError } from "../../../shared/errors/user-error/UserOrderError";
import { DecryptData } from "../../../shared/providers/aes/decrypt/DecryptData";

// exportando controller
export class FindOrderController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // instânciando interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findUserOrderRepository = new FindUserOrderRepository();
    const decryptData = new DecryptData();

    // instânciando usecase
    const useCase = new FindOrderUseCase(
      findUserByIdRepository,
      findUserOrderRepository,
      decryptData
    );

    // criando try/catch para capturar erros na execução
    try {
      const order = await useCase.execute({ userId });

      return response.status(200).json(order);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de solicitação não encontrada
      if (err instanceof UserOrderNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
