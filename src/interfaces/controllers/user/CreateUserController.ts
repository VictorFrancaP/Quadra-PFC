// Importando Request, Response do express
import { Request, Response } from "express";

// Importando implementações das interfaces a serem instânciadas
import { FindUserByCPFRepository } from "../../../infrastruture/repository/user/FindUserByCPFRepository";
import { RedisProvider } from "../../../shared/providers/redis/provider/RedisProvider";
import { HashProvider } from "../../../shared/providers/bcrypt/hash/HashProvider";
import { CreateUserRepository } from "../../../infrastruture/repository/user/CreateUserRepository";
import { MailProvider } from "../../../shared/providers/mail/provider/MailProvider";

// Importando usecase
import { CreateUserUseCase } from "../../../application/usecases/user/CreateUserUseCase";

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
    const createUserRepository = new CreateUserRepository();
    const mailProvider = new MailProvider();

    // Instânciando a usecase
    const useCase = new CreateUserUseCase(
      findUserByCPFRepository,
      redisProvider,
      hashProvider,
      createUserRepository,
      mailProvider
    );

    // criando try/catch para a captura de erros na execução
    try {
      await useCase.execute({
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
      });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
