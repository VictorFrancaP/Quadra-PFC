// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindCepSoccerRepository } from "../../../infrastruture/repository/soccer/FindCepSoccerRepository";
import { FindUserOrderRepository } from "../../../infrastruture/repository/order/FindUserOrderRepository";
import { OpenCageProvider } from "../../../shared/providers/geocoding/OpenCageProvider";
import { FindCnpjOwnerSoccerRepository } from "../../../infrastruture/repository/soccer/FindCnpjOwnerSoccerRepositories";
import { CreateOwnerSoccerRepository } from "../../../infrastruture/repository/soccer/CreateOwnerSoccerRepository";

// Importando usecase
import { CreateOwnerSoccerUseCase } from "../../../application/usecases/soccer/create/CreateOwnerSoccerUseCase";

// exportando controller
export class CreateOwnerSoccerController {
  async handle(request: Request, response: Response) {
    // atributos
    const userId = request.user.id;
    const {
      name,
      description,
      cep,
      address,
      city,
      state,
      operationDays,
      openHour,
      closingHour,
      priceHour,
      maxDuration,
    } = request.body;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findCepSoccerRepository = new FindCepSoccerRepository();
    const findUserOrderRepository = new FindUserOrderRepository();
    const findCnpjOwnerSoccerRepository = new FindCnpjOwnerSoccerRepository();
    const openCageProvider = new OpenCageProvider();
    const createOwnerSoccerRepository = new CreateOwnerSoccerRepository();

    // instância da usecase
    const useCase = new CreateOwnerSoccerUseCase(
      findUserByIdRepository,
      findCepSoccerRepository,
      findUserOrderRepository,
      findCnpjOwnerSoccerRepository,
      openCageProvider,
      createOwnerSoccerRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const soccer = await useCase.execute({
        userId,
        name,
        description,
        cep,
        address,
        city,
        state,
        operationDays,
        openHour,
        closingHour,
        priceHour,
        maxDuration,
      });

      return response
        .status(200)
        .json({ message: "Sua quadra foi cadastrada com sucesso!", soccer });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
