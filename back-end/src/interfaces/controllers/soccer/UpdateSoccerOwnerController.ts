// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerOwnerRepository } from "../../../infrastruture/repository/soccer/FindSoccerOwnerRepository";
import { OpenCageProvider } from "../../../shared/providers/geocoding/OpenCageProvider";
import { EncryptData } from "../../../shared/providers/aes/encrypt/EncryptData";
import { UpdateSoccerOwnerRepository } from "../../../infrastruture/repository/soccer/UpdateSoccerOwnerRepository";

// Importando usecase
import { UpdateSoccerOwnerUseCase } from "../../../application/usecases/soccer/update/UpdateSoccerOwnerUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SoccerAccessDeniedUpdateError } from "../../../shared/errors/soccer-error/SoccerAccessDeniedError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";

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
      images,
      observations,
    } = request.body;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerOwnerRepository = new FindSoccerOwnerRepository();
    const openCageProvider = new OpenCageProvider();
    const encryptData = new EncryptData();
    const updateSoccerOwnerRepository = new UpdateSoccerOwnerRepository();

    // instância da usecase
    const useCase = new UpdateSoccerOwnerUseCase(
      findUserByIdRepository,
      findSoccerOwnerRepository,
      openCageProvider,
      encryptData,
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
        images,
        observations,
      });

      return response.status(200).json({
        message: "As informações da sua quadra foi atualizada com sucesso!",
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente para atualizar a quadra
      if (err instanceof SoccerAccessDeniedUpdateError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de quadra não encontrada na base de dados
      if (err instanceof SoccerNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
