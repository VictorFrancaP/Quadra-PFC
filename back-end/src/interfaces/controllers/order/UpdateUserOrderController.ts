// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces a serem instânciadas nesta classe
import { FindUserOrderRepository } from "../../../infrastruture/repository/order/FindUserOrderRepository";
import { RedisProvider } from "../../../shared/providers/redis/provider/RedisProvider";
import { EncryptData } from "../../../shared/providers/aes/encrypt/EncryptData";
import { UpdateUserOrderRepository } from "../../../infrastruture/repository/order/UpdateUserOrderRepository";

// Importando usecase
import { UpdateUserOrderUseCase } from "../../../application/usecases/order/update/UpdateUserOrderUseCase";

// exportando controller
export class UpdateUserOrderController {
  async handle(request: Request, response: Response) {
    // atributos
    const { localName, description, fone } = request.body;
    const userId = request.user.id;

    // instâncias das interfaces implementadas
    const findUserOrderRepository = new FindUserOrderRepository();
    const redisProvider = new RedisProvider();
    const encryptData = new EncryptData();
    const updateUserOrderRepository = new UpdateUserOrderRepository();

    // instância da usecase
    const useCase = new UpdateUserOrderUseCase(
      findUserOrderRepository,
      redisProvider,
      encryptData,
      updateUserOrderRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ localName, description, fone, userId });

      return response.status(200).json({
        message: "Sua solicitação foi atualizado com sucesso!",
      });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
