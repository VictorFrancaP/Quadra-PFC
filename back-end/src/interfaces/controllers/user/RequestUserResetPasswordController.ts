// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces a serem instãnciadas nesta classe
import { FindUserByEmailRepository } from "../../../infrastruture/repository/user/FindUserByEmailRepository";
import { LockUserAccountRepository } from "../../../infrastruture/repository/user/LockUserAccountRepository";
import { DayJsProvider } from "../../../shared/providers/dayjs/DayJsProvider";
import { MailProvider } from "../../../shared/providers/mail/provider/MailProvider";
import { ResetTokenProvider } from "../../../shared/providers/tokens/crypto/ResetToken";
import { UpdateUserRepository } from "../../../infrastruture/repository/user/UpdateUserRepository";
import { PictureConfig } from "../../../shared/providers/cloudinary/default-profile/PictureConfig";

// Importando usecase
import { RequestUserResetPasswordUseCase } from "../../../application/usecases/user/password-reset/RequestUserResetPasswordUseCase";

// Importando error personalizado
import { SendMailUserNotFoundError } from "../../../shared/errors/send-mail-error/SendMailUserNotFoundError";
import { AccountUserIsLockedError } from "../../../shared/errors/user-error/AccountUserIsLockedError";
import { AccountUserIsBlockError } from "../../../shared/errors/user-error/AccountUserIsLockedError";

// exportando controller
export class RequestUserResetPasswordController {
  async handle(request: Request, response: Response) {
    // atributos
    const { email } = request.body;

    // instâncias das interfaces implementadas
    const findUserByEmailRepository = new FindUserByEmailRepository();
    const lockUserAccountRepository = new LockUserAccountRepository();
    const dayJsProvider = new DayJsProvider();
    const mailProvider = new MailProvider();
    const resetTokenProvider = new ResetTokenProvider();
    const updateUserRepository = new UpdateUserRepository();
    const pictureConfig = new PictureConfig();

    // instância da usecase
    const useCase = new RequestUserResetPasswordUseCase(
      findUserByEmailRepository,
      lockUserAccountRepository,
      dayJsProvider,
      mailProvider,
      resetTokenProvider,
      updateUserRepository,
      pictureConfig
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ email });

      return response.status(200).json({
        message:
          "Caso este e-mail correto, enviamos uma solicitação de redefinição de senha!",
      });
    } catch (err: any) {
      // tratando erros de separada

      // erro de envio de e-mail para o usuário
      if (err instanceof SendMailUserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de conta bloqueada temporariamente
      if (err instanceof AccountUserIsLockedError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de conta bloqueada permanentemente
      if (err instanceof AccountUserIsBlockError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json({
        message: err.message,
      });
    }
  }
}
