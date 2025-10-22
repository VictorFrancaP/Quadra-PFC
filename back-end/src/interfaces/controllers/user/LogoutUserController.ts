// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { DeleteManyRefreshTokenRepository } from "../../../infrastruture/repository/refresh-token/DeleteManyRefreshTokenRepository";

// Importando usecase
import { LogoutUserUseCase } from "../../../application/usecases/user/logout/LogoutUserUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";

// exportando controller
export class LogoutUserController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // instânciando interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const deleteManyRefreshTokenRepository =
      new DeleteManyRefreshTokenRepository();

    // instânciando usecase
    const useCase = new LogoutUserUseCase(
      findUserByIdRepository,
      deleteManyRefreshTokenRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ userId });

      response.clearCookie("RefreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return response.status(204).send();
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de caso o usuário não exista
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
