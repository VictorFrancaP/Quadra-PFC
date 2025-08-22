// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas
import { FindUserByEmailRepository } from "../../../infrastruture/repository/user/FindUserByEmailRepository";
import { CreateUserRepository } from "../../../infrastruture/repository/user/CreateUserRepository";
import { TokenProvider } from "../../../shared/providers/tokens/jwt/TokenProvider";
import { DeleteManyRefreshTokenRepository } from "../../../infrastruture/repository/refresh-token/DeleteManyRefreshTokenRepository";
import { CreateRefreshTokenRepository } from "../../../infrastruture/repository/refresh-token/CreateRefreshTokenRepository";

// Importando usecase
import { SocialUserLoginUseCase } from "../../../application/usecases/user/login/SocialUserLoginUseCase";

// exportando controller
export class SocialUserLoginController {
  async handle(request: Request, response: Response) {
    const { name, email, profileImage } = request.user as any;

    // instâncias das interfaces
    const findUserByEmailRepository = new FindUserByEmailRepository();
    const createUserRepository = new CreateUserRepository();
    const tokenProvider = new TokenProvider();
    const deleteManyRefreshTokenRepository =
      new DeleteManyRefreshTokenRepository();
    const createRefreshTokenRepository = new CreateRefreshTokenRepository();

    // instânciando usecase
    const useCase = new SocialUserLoginUseCase(
      findUserByEmailRepository,
      createUserRepository,
      tokenProvider,
      deleteManyRefreshTokenRepository,
      createRefreshTokenRepository
    );

    // criando try/catch para captura de erros na execução
    try {
      const authenticated = await useCase.execute({
        name,
        email,
        profileImage,
      });

      return response.status(200).json({ authenticated });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
