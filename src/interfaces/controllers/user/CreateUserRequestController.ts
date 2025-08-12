// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces a ser instânciadas
import { FindUserByEmailRepository } from "../../../infrastruture/repository/user/FindUserByEmailRepository";
import { ResetTokenProvider } from "../../../shared/providers/tokens/crypto/ResetToken";
import { RedisProvider } from "../../../shared/providers/redis/provider/RedisProvider";
import { MailProvider } from "../../../shared/providers/mail/provider/MailProvider";

// Importando useCase
import { CreateUserRequestUseCase } from "../../../application/usecases/user/CreateUserRequestUseCase";

// exportando classe controller
export class CreateUserRequestController {
  async handle(request: Request, response: Response) {
    // atributos preenchidos pelo usuários (passados pelo body)
    const { name, email } = request.body;

    // instâncias das interfaces implementadas
    const findUserByEmailRepository = new FindUserByEmailRepository();
    const resetTokenProvider = new ResetTokenProvider();
    const redisProvider = new RedisProvider();
    const mailProvider = new MailProvider();

    // instânciando usecase
    const useCase = new CreateUserRequestUseCase(
      findUserByEmailRepository,
      resetTokenProvider,
      redisProvider,
      mailProvider
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ name, email });

      return response.status(200).json({
        message:
          "Enviamos um e-mail de confirmação para você confirmar o cadastro",
      });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
