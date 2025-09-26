// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { TotpProvider } from "../../../shared/providers/totp/TotpProvider";
import { UpdateUserRepository } from "../../../infrastruture/repository/user/UpdateUserRepository";

// Importando usecase
import { Setup2FAUserUseCase } from "../../../application/usecases/user/2fa/Setup2FAUserUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { Setup2FAUserError } from "../../../shared/errors/user-error/Setup2FAUserError";

// exportando controller
export class Setup2FAUserController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const totpProvider = new TotpProvider();
    const updateUserRepository = new UpdateUserRepository();

    // instância da usecase
    const useCase = new Setup2FAUserUseCase(
      findUserByIdRepository,
      totpProvider,
      updateUserRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const otpUrl = await useCase.execute({ userId });

      return response.status(200).json(otpUrl);
    } catch (err: any) {
      // tratando erros de forma separada

      //   erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de autenticação de dois fatores já ativada
      if (err instanceof Setup2FAUserError) {
        return response.status(err.statusCode).json(err.message);
      }

      // retornando erro desconhecido
      return response.status(500).json({
        message: err.message,
      });
    }
  }
}
