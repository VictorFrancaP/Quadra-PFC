// Importando Request, Response do express
import { Request, Response } from "express";

// Importando implementações das interfaces a serem instânciadas
import { FindUserByCPFRepository } from "../../../infrastruture/repository/user/FindUserByCPFRepository";
import { RedisProvider } from "../../../shared/providers/redis/provider/RedisProvider";
import { HashProvider } from "../../../shared/providers/bcrypt/hash/HashProvider";
import { OpenCageProvider } from "../../../shared/providers/geocoding/OpenCageProvider";
import { PictureConfig } from "../../../shared/providers/cloudinary/default-profile/PictureConfig";
import { CreateUserRepository } from "../../../infrastruture/repository/user/CreateUserRepository";
import { MailProvider } from "../../../shared/providers/mail/provider/MailProvider";

// Importando usecase
import { CreateUserUseCase } from "../../../application/usecases/user/create/CreateUserUseCase";

// Importando error personalizado
import { UserFoundError } from "../../../shared/errors/user-error/UserFoundError";
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";

// exportando classe controller
export class CreateUserController {
  async handle(request: Request, response: Response) {
    // atributos
    const { token } = request.params;
    const { password, age, address, cep, cpf, gender } = request.body;

    // Instãncias das implementações das interfaces
    const findUserByCPFRepository = new FindUserByCPFRepository();
    const redisProvider = new RedisProvider();
    const hashProvider = new HashProvider();
    const openCageProvider = new OpenCageProvider();
    const pictureConfig = new PictureConfig();
    const createUserRepository = new CreateUserRepository();
    const mailProvider = new MailProvider();

    // Instânciando a usecase
    const useCase = new CreateUserUseCase(
      findUserByCPFRepository,
      redisProvider,
      hashProvider,
      openCageProvider,
      pictureConfig,
      createUserRepository,
      mailProvider
    );

    // criando try/catch para a captura de erros na execução
    try {
      const user = await useCase.execute({
        token: token as string,
        password,
        age,
        address,
        cep,
        cpf,
        gender,
      });

      return response.status(200).json({
        message: "Sua conta foi criada com sucesso!",
        user,
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de cpf ja utilizado
      if (err instanceof UserFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de dados não encontrados no cache
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // retornando erro desconhecido
      return response.status(500).json({
        message: err.message,
      });
    }
  }
}
