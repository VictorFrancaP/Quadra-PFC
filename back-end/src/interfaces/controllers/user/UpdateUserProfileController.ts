// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { RedisProvider } from "../../../shared/providers/redis/provider/RedisProvider";
import { OpenCageProvider } from "../../../shared/providers/geocoding/OpenCageProvider";
import { UpdateUserRepository } from "../../../infrastruture/repository/user/UpdateUserRepository";

// Importando usecase
import { UpdateUserProfileUseCase } from "../../../application/usecases/user/update/UpdateUserProfileUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { AddUserProfileInfoError } from "../../../shared/errors/user-error/AddUserProfileInfoError";
import { LimitRatingUpdateProfileUserError } from "../../../shared/errors/send-mail-error/LimitRatingSendMailError";

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
      // tratando erros de forma separada

      // erro de usuário nao encontrado na base de dados
      if(err instanceof UserNotFoundError) {
       return response.status(err.statusCode).json(err.message); 
      }

      // erro de adicionar informações para o perfil do usuário
      if(err instanceof AddUserProfileInfoError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de limite de requisição para usuário
      if(err instanceof LimitRatingUpdateProfileUserError) {
        return response.status(err.statusCode).json(err.message);
      }

      // retornando erro desconhecido
      return response.status(500).json({
        message: err.message,
      });
    }
  }
}
