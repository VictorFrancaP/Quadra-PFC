// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces a ser instânciadas
import { FindUserByEmailRepository } from "../../../infrastruture/repository/user/FindUserByEmailRepository";
import { ResetTokenProvider } from "../../../shared/providers/tokens/crypto/ResetToken";
import { RedisProvider } from "../../../shared/providers/redis/provider/RedisProvider";
import { MailProvider } from "../../../shared/providers/mail/provider/MailProvider";
import { PictureConfig } from "../../../shared/providers/cloudinary/default-profile/PictureConfig";

// Importando useCase
import { CreateUserRequestUseCase } from "../../../application/usecases/user/create/CreateUserRequestUseCase";

// Importando error personalizado
import { UserFoundError } from "../../../shared/errors/user-error/UserFoundError";
import { LimitRatingSendMailError } from "../../../shared/errors/send-mail-error/LimitRatingSendMailError";

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
    const pictureConfig = new PictureConfig();

    // instânciando usecase
    const useCase = new CreateUserRequestUseCase(
      findUserByEmailRepository,
      resetTokenProvider,
      redisProvider,
      mailProvider,
      pictureConfig
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ name, email });

      return response.status(200).json({
        message:
          "Enviamos um e-mail de confirmação para você confirmar o cadastro!",
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário ja cadastrado no sistema
      if (err instanceof UserFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de limite de requisição para o envio de confirmação de e-mail
      if (err instanceof LimitRatingSendMailError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
