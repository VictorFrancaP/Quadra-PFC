// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindCepSoccerRepository } from "../../../infrastruture/repository/soccer/FindCepSoccerRepository";
import { FindUserOrderRepository } from "../../../infrastruture/repository/order/FindUserOrderRepository";
import { OpenCageProvider } from "../../../shared/providers/geocoding/OpenCageProvider";
import { FindCnpjOwnerSoccerRepository } from "../../../infrastruture/repository/soccer/FindCnpjOwnerSoccerRepositories";
import { CreateOwnerSoccerRepository } from "../../../infrastruture/repository/soccer/CreateOwnerSoccerRepository";
import { PictureConfig } from "../../../shared/providers/cloudinary/default-profile/PictureConfig";

// Importando usecase
import { CreateOwnerSoccerUseCase } from "../../../application/usecases/soccer/create/CreateOwnerSoccerUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedSoccerError } from "../../../shared/errors/user-error/UserAccessDeniedError";
import { SoccerFoundError } from "../../../shared/errors/soccer-error/SoccerFoundError";
import { UserOrderNotFoundError } from "../../../shared/errors/user-error/UserOrderError";
import { SoccerCnpjError } from "../../../shared/errors/soccer-error/SoccerCnpjError";

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
      ownerPixKey,
    } = request.body;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findCepSoccerRepository = new FindCepSoccerRepository();
    const findUserOrderRepository = new FindUserOrderRepository();
    const findCnpjOwnerSoccerRepository = new FindCnpjOwnerSoccerRepository();
    const openCageProvider = new OpenCageProvider();
    const pictureConfig = new PictureConfig();
    const createOwnerSoccerRepository = new CreateOwnerSoccerRepository();

    // instância da usecase
    const useCase = new CreateOwnerSoccerUseCase(
      findUserByIdRepository,
      findCepSoccerRepository,
      findUserOrderRepository,
      findCnpjOwnerSoccerRepository,
      openCageProvider,
      pictureConfig,
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
        ownerPixKey,
      });

      return response
        .status(200)
        .json({ message: "Sua quadra foi cadastrada com sucesso!", soccer });
    } catch (err: any) {
      // tratando erros de separada

      // erro de usuario não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente para criar quadra
      if (err instanceof UserAccessDeniedSoccerError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de quadra já cadastrada na base de dados
      if (err instanceof SoccerFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de solicitação de usuário não encontrada na base de dados
      if (err instanceof UserOrderNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de cnpj já utilizado no sistema
      if (err instanceof SoccerCnpjError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
