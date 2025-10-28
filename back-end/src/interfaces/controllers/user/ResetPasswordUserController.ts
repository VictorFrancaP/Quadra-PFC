// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserResetTokenRepository } from "../../../infrastruture/repository/user/FindUserResetTokenRepository";
import { DayJsProvider } from "../../../shared/providers/dayjs/DayJsProvider";
import { CompareProvider } from "../../../shared/providers/bcrypt/compare/CompareProvider";
import { HashProvider } from "../../../shared/providers/bcrypt/hash/HashProvider";
import { UpdateUserRepository } from "../../../infrastruture/repository/user/UpdateUserRepository";
import { MailProvider } from "../../../shared/providers/mail/provider/MailProvider";
import { PictureConfig } from "../../../shared/providers/cloudinary/default-profile/PictureConfig";

// Importando usecase
import { ResetPasswordUserUseCase } from "../../../application/usecases/user/password-reset/ResetPasswordUserUseCase";

// Importando error personalizado
import { TokenUserError } from "../../../shared/errors/user-error/TokenUserError";
import { ExpiredTimeUserError } from "../../../shared/errors/user-error/TokenUserError";
import { PasswordUserSameError } from "../../../shared/errors/user-error/CredentialsUserError";

// exportando controller
export class ResetPasswordUserController {
  async handle(request: Request, response: Response) {
    // dados necessários
    const { token } = request.params;
    const { password } = request.body;

    // instâncias das interfaces implementadas
    const findUserResetTokenRepository = new FindUserResetTokenRepository();
    const dayJsProvider = new DayJsProvider();
    const compareProvider = new CompareProvider();
    const hashProvider = new HashProvider();
    const updateUserRepository = new UpdateUserRepository();
    const mailProvider = new MailProvider();
    const pictureConfig = new PictureConfig();

    // instância da usecase
    const useCase = new ResetPasswordUserUseCase(
      findUserResetTokenRepository,
      dayJsProvider,
      compareProvider,
      hashProvider,
      updateUserRepository,
      mailProvider,
      pictureConfig
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ token: token as string, password });

      return response.status(200).json({
        message: "Sua senha foi alterado com sucesso!",
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de token invalido ou não encontrado
      if (err instanceof TokenUserError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de tempo limite para trocar a senha expirado
      if (err instanceof ExpiredTimeUserError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de senha semelhante para o usuário
      if (err instanceof PasswordUserSameError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json({
        message: err.message,
      });
    }
  }
}
