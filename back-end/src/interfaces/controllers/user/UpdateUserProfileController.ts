// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { RedisProvider } from "../../../shared/providers/redis/provider/RedisProvider";
import { OpenCageProvider } from "../../../shared/providers/geocoding/OpenCageProvider";
import { UpdateUserRepository } from "../../../infrastruture/repository/user/UpdateUserRepository";

// Importando usecase
import { UpdateUserProfileUseCase } from "../../../application/usecases/user/update/UpdateUserProfileUseCase";

// exportando controller
export class UpdateUserProfileController {
  async handle(request: Request, response: Response) {
    // dados obrigatórios e opcionais
    const userId = request.user.id;
    const { name, age, address, cep, cpf } = request.body;

    // instânciando interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const redisProvider = new RedisProvider();
    const openCageProvider = new OpenCageProvider();
    const updateUserRepository = new UpdateUserRepository();

    // instânciando usecase
    const useCase = new UpdateUserProfileUseCase(
      findUserByIdRepository,
      redisProvider,
      openCageProvider,
      updateUserRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ userId, name, age, address, cep, cpf });

      return response.status(200).json({
        message: "Suas informações foram atualizadas com sucesso!",
      });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
