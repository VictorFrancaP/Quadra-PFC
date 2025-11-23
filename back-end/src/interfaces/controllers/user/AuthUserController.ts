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
import { AuthUserUseCase } from "../../../application/usecases/user/login/AuthUserUseCase";

// Importando error personalizado
import { CredentialsUserError } from "../../../shared/errors/user-error/CredentialsUserError";
import { AccountUserIsLockedError } from "../../../shared/errors/user-error/AccountUserIsLockedError";
import { AccountUserIsLockedNowError } from "../../../shared/errors/user-error/AccountUserIsLockedError";
import { AccountUserIsBlockError } from "../../../shared/errors/user-error/AccountUserIsLockedError";

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
      const authResponse = await useCase.execute({ email, password });

      // caso o usuário já tenha autenticação de dois fatores
      if (authResponse.step === "2fa_required") {
        return response.status(200).json({
          step: authResponse.step,
          user: authResponse.user,
        });
      }

      // caso o usuário não autenticação de dois fatores
      if (authResponse.step === "setup_2fa") {
        // desestruturação dos dados
        const { token, refreshToken } = authResponse;

        // criando variavel de ambiente para produção
        const isProduction = process.env.NODE_ENV === "production";

        // armazenando refreshToken no httpOnly para maior segurança
        response.cookie("RefreshToken", refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // retornando dados
        return response.status(200).json({
          step: authResponse.step,
          user: authResponse.user,
          token,
        });
      }
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de credenciais invalidas
      if (err instanceof CredentialsUserError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de conta do usuário bloqueado temporariamente
      if (err instanceof AccountUserIsLockedError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de conta do usuário bloqueado agora
      if (err instanceof AccountUserIsLockedNowError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de conta do usuário bloqueado permanentemente
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
