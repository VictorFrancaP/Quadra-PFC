// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface a serem instânciadas nesta classe
import { FindUserCnpjOrderRepository } from "../../../infrastruture/repository/order/FindUserCnpjOrderRepository";
import { FindUserOrderRepository } from "../../../infrastruture/repository/order/FindUserOrderRepository";
import { EncryptData } from "../../../shared/providers/aes/encrypt/EncryptData";
import { CreateOrderRepository } from "../../../infrastruture/repository/order/CreateOrderRepository";

// Importando usecase
import { CreateOrderUserUseCase } from "../../../application/usecases/order/create/CreateOrderUserUseCase";

// exportando controller
export class CreateOrderUserController {
  async handle(request: Request, response: Response) {
    // dados a serem passados
    const { localName, description, cnpj, fone } = request.body;
    const userId = request.user.id;

    // instânciando interfaces implementadas
    const findUserCnpjOrderRepository = new FindUserCnpjOrderRepository();
    const findUserOrderRepository = new FindUserOrderRepository();
    const encryptData = new EncryptData();
    const createOrderRepository = new CreateOrderRepository();

    // instância da usecase
    const useCase = new CreateOrderUserUseCase(
      findUserCnpjOrderRepository,
      findUserOrderRepository,
      encryptData,
      createOrderRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({
        localName,
        description,
        cnpj,
        fone,
        userId,
      });

      return response.status(200).json({
        message: "Sua solicitação foi criada com sucesso!",
      });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
