// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerOwnerRepository } from "../../../infrastruture/repository/soccer/FindSoccerOwnerRepository";
import { UpdateSoccerOwnerRepository } from "../../../infrastruture/repository/soccer/UpdateSoccerOwnerRepository";

// Importando usecase
import { UpdateSoccerOwnerUseCase } from "../../../application/usecases/soccer/UpdateSoccerOwnerUseCase";

// exportando controller
export class UpdateSoccerOwnerController {
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
      fone,
      operationDays,
      openHour,
      closingHour,
      priceHour,
      maxDuration,
      isActive,
      observations,
    } = request.body;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerOwnerRepository = new FindSoccerOwnerRepository();
    const updateSoccerOwnerRepository = new UpdateSoccerOwnerRepository();

    // instância da usecase
    const useCase = new UpdateSoccerOwnerUseCase(
      findUserByIdRepository,
      findSoccerOwnerRepository,
      updateSoccerOwnerRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({
        userId,
        name,
        description,
        cep,
        address,
        city,
        state,
        fone,
        operationDays,
        openHour,
        closingHour,
        priceHour,
        maxDuration,
        isActive,
        observations,
      });

      return response.status(200).json({
        message: "As informações da sua quadra foi atualizada com sucesso!",
      });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
