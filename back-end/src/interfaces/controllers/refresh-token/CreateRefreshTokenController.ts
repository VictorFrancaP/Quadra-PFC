// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas
import { FindUserRefreshTokenRepository } from "../../../infrastruture/repository/refresh-token/FindUserRefreshTokenRepository";
import { TokenProvider } from "../../../shared/providers/tokens/jwt/TokenProvider";

// Importando usecase
import { CreateRefreshTokenUseCase } from "../../../application/usecases/refresh-token/create/CreateRefreshTokenUseCase";

// exportando controller
export class CreateRefreshTokenController {
  async handle(request: Request, response: Response) {
    // pegando refreshToken dos cookies
    const refresh_token = request.cookies["RefreshToken"];

    // Instãncias das interfaces implementadas
    const findUserRefreshTokenRepository = new FindUserRefreshTokenRepository();
    const tokenProvider = new TokenProvider();

    // instância da usecase
    const useCase = new CreateRefreshTokenUseCase(
      findUserRefreshTokenRepository,
      tokenProvider
    );

    // criando try/catch para a captura de erros na execução
    try {
      // usando desestruturação para pegar os dados de token e refreshToken
      const { token } = await useCase.execute({
        refreshToken: refresh_token,
      });

      return response.status(200).json({ token });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
