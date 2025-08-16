// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface a serem instânciadas nesta classe
import { FindUserByEmailRepository } from "../../../infrastruture/repository/user/FindUserByEmailRepository";
import { LockUserAccountRepository } from "../../../infrastruture/repository/user/LockUserAccountRepository";
import { CompareProvider } from "../../../shared/providers/bcrypt/compare/CompareProvider";
import { UpdateUserRepository } from "../../../infrastruture/repository/user/UpdateUserRepository";
import { DayJsProvider } from "../../../shared/providers/dayjs/DayJsProvider";
import { DeleteManyRefreshTokenRepository } from "../../../infrastruture/repository/refresh-token/DeleteManyRefreshTokenRepository";
import { TokenProvider } from "../../../shared/providers/tokens/jwt/TokenProvider";
import { CreateRefreshTokenRepository } from "../../../infrastruture/repository/refresh-token/CreateRefreshTokenRepository";

// Importando usecase
import { AuthUserUseCase } from "../../../application/usecases/user/AuthUserUseCase";

// exportando controller
export class AuthUserController {
  async handle(request: Request, response: Response) {
    const { email, password } = request.body;

    // instâncias das interface implementadas
    const findUserByEmailRepository = new FindUserByEmailRepository();
    const lockUserAccountRepository = new LockUserAccountRepository();
    const compareProvider = new CompareProvider();
    const dayJsProvider = new DayJsProvider();
    const updateUserRepository = new UpdateUserRepository();
    const deleteManyRefreshTokenRepository =
      new DeleteManyRefreshTokenRepository();
    const tokenProvider = new TokenProvider();
    const createRefreshTokenRepository = new CreateRefreshTokenRepository();

    // instânciando usecase
    const useCase = new AuthUserUseCase(
      findUserByEmailRepository,
      lockUserAccountRepository,
      compareProvider,
      dayJsProvider,
      updateUserRepository,
      deleteManyRefreshTokenRepository,
      tokenProvider,
      createRefreshTokenRepository
    );

    // criando try/catch para a captura de erros na execução
    try {
      // usando desestruturação para pegar dados vindos da usecase
      const { name, token, refreshToken } = await useCase.execute({
        email,
        password,
      });

      // armazenando refreshToken no httpOnly para maior segurança
      response.cookie("RefreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return response.status(200).json({ name, token });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
