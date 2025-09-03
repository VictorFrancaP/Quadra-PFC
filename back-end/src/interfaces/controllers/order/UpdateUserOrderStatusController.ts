// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindOrderByIdRepository } from "../../../infrastruture/repository/order/FindOrderByIdRepository";
import { UpdateUserOrderRepository } from "../../../infrastruture/repository/order/UpdateUserOrderRepository";

// Importando usecase
import { UpdateUserOrderStatusUseCase } from "../../../application/usecases/order/UpdateUserOrderStatusUseCase";

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
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
