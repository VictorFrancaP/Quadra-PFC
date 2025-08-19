// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces a serem instãnciadas nesta classe
import { FindUserByEmailRepository } from "../../../infrastruture/repository/user/FindUserByEmailRepository";
import { LockUserAccountRepository } from "../../../infrastruture/repository/user/LockUserAccountRepository";
import { DayJsProvider } from "../../../shared/providers/dayjs/DayJsProvider";
import { MailProvider } from "../../../shared/providers/mail/provider/MailProvider";
import { ResetTokenProvider } from "../../../shared/providers/tokens/crypto/ResetToken";
import { UpdateUserRepository } from "../../../infrastruture/repository/user/UpdateUserRepository";

// Importando usecase
import { RequestUserResetPasswordUseCase } from "../../../application/usecases/user/RequestUserResetPasswordUseCase";

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

    // instância da usecase
    const useCase = new RequestUserResetPasswordUseCase(
      findUserByEmailRepository,
      lockUserAccountRepository,
      dayJsProvider,
      mailProvider,
      resetTokenProvider,
      updateUserRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ email });

      return response.status(200).json({
        message:
          "Caso este e-mail correto, enviamos uma solicitação de redefinição de senha!",
      });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
