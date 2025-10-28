// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas
import { FindUserRefreshTokenRepository } from "../../../infrastruture/repository/refresh-token/FindUserRefreshTokenRepository";
import { TokenProvider } from "../../../shared/providers/tokens/jwt/TokenProvider";
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";

// Importando usecase
import { CreateRefreshTokenUseCase } from "../../../application/usecases/refresh-token/create/CreateRefreshTokenUseCase";

// Importando classe de error personalizada
import { RefreshTokenNotFoundError } from "../../../shared/errors/refresh-token-error/RefreshTokenNotFoundError";
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";

// exportando controller
export class CreateRefreshTokenController {
  async handle(request: Request, response: Response) {
    // pegando refreshToken dos cookies
    const refresh_token = request.cookies["RefreshToken"];

    // Instãncias das interfaces implementadas
    const findUserRefreshTokenRepository = new FindUserRefreshTokenRepository();
    const tokenProvider = new TokenProvider();
    const findUserByIdRepository = new FindUserByIdRepository();

    // instância da usecase
    const useCase = new CreateRefreshTokenUseCase(
      findUserRefreshTokenRepository,
      tokenProvider,
      findUserByIdRepository
    );

    // criando try/catch para a captura de erros na execução
    try {
      // verificando o se refreshToken existe no cookies do navegador
      if (!refresh_token) {
        throw new RefreshTokenNotFoundError();
      }

      // usando desestruturação para pegar os dados de token e refreshToken
      const { token, user } = await useCase.execute({
        refreshToken: refresh_token,
      });

      return response.status(200).json({ token, user });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de refreshToken não encontrado
      if (err instanceof RefreshTokenNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de usuário não encontrado
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
