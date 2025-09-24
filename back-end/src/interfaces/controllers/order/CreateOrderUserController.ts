// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface a serem instânciadas nesta classe
import { FindUserCnpjOrderRepository } from "../../../infrastruture/repository/order/FindUserCnpjOrderRepository";
import { FindUserOrderRepository } from "../../../infrastruture/repository/order/FindUserOrderRepository";
import { EncryptData } from "../../../shared/providers/aes/encrypt/EncryptData";
import { CreateOrderRepository } from "../../../infrastruture/repository/order/CreateOrderRepository";

// Importando usecase
import { CreateOrderUserUseCase } from "../../../application/usecases/order/create/CreateOrderUserUseCase";

// Importando error personalizado
import { UserOrderError } from "../../../shared/errors/user-error/UserOrderError";
import { UserOrderCnpjError } from "../../../shared/errors/user-error/UserOrderError";

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
      // tratando erros de forma separada

      // erro de usuário já cadastrou este CNPJ
      if (err instanceof UserOrderCnpjError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de usuário ja realizou uma solicitação
      if (err instanceof UserOrderError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
