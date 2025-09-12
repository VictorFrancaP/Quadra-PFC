// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindOrdersRepository } from "../../../infrastruture/repository/order/FindOrdersRepository";
import { DecryptData } from "../../../shared/providers/aes/decrypt/DecryptData";

// Importando usecase
import { FindOrdersUseCase } from "../../../application/usecases/order/list/FindOrdersUseCase";

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
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
