// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { TotpProvider } from "../../../shared/providers/totp/TotpProvider";
import { UpdateUserRepository } from "../../../infrastruture/repository/user/UpdateUserRepository";
import { DeleteManyRefreshTokenRepository } from "../../../infrastruture/repository/refresh-token/DeleteManyRefreshTokenRepository";
import { TokenProvider } from "../../../shared/providers/tokens/jwt/TokenProvider";
import { CreateRefreshTokenRepository } from "../../../infrastruture/repository/refresh-token/CreateRefreshTokenRepository";

// Importando usecase
import { Verify2FAUserUseCase } from "../../../application/usecases/user/2fa/Verify2FAUserUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { Verify2FAUserError } from "../../../shared/errors/user-error/Verify2FAUserError";
import { IncorrectToken2FAUserError } from "../../../shared/errors/user-error/Verify2FAUserError";

// exportando controller
export class Verify2FAUserController {
  async handle(request: Request, response: Response) {
    // usuario logado
    const { userId } = request.params;
    const { token } = request.body;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const totpProvider = new TotpProvider();
    const updateUserRepository = new UpdateUserRepository();
    const deleteManyRefreshTokenRepository =
      new DeleteManyRefreshTokenRepository();
    const tokenProvider = new TokenProvider();
    const createRefreshTokenRepository = new CreateRefreshTokenRepository();

    // instância da usecase
    const useCase = new Verify2FAUserUseCase(
      findUserByIdRepository,
      totpProvider,
      updateUserRepository,
      deleteManyRefreshTokenRepository,
      tokenProvider,
      createRefreshTokenRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const verifyResponse = await useCase.execute({ userId: userId!, token });

      if (!verifyResponse.accessToken) {
        return response.status(200).json({
          message: "Autenticação de dois fatores foi ativada com sucesso!",
        });
      }

      // desestruturando os dados de resposta
      const { accessToken, refreshToken } = verifyResponse;

      // armazenando refreshToken no cookies
      response.cookie("RefreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // retornando token
      return response.status(200).json({
        accessToken,
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de primeiro login
      if (err instanceof Verify2FAUserError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de codigo invalido
      if (err instanceof IncorrectToken2FAUserError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json({
        message: err.message,
      });
    }
  }
}
