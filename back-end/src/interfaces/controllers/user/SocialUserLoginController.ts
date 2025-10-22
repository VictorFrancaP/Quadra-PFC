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
      const socialResponse = await useCase.execute({
        name,
        email,
        profileImage,
      });

      // caso o usuário já tenha o 2fa ativado
      if (socialResponse.step === "2fa_required") {
        //  url para redirecionar
        const redirectUrl = new URL(`${process.env.FRONT_HOST}/login`);
        redirectUrl.searchParams.append("step", socialResponse.step);
        redirectUrl.searchParams.append("userId", socialResponse.user.id as string);

        return response.redirect(redirectUrl.toString());
      }

      // caso o usuário não tenha o 2fa ativado
      if (socialResponse.step === "setup_2fa") {
        const { token, refreshToken } = socialResponse;

        // armazenando refreshToken em cookie
        response.cookie("RefreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        //  url para redirecionar
        const redirectUrl = new URL(`${process.env.FRONT_HOST}/login`);
        redirectUrl.searchParams.append("step", socialResponse.step);
        redirectUrl.searchParams.append(
          "token",
          socialResponse.token as string
        );

        return response.redirect(redirectUrl.toString());
      }
    } catch (err: any) {
      const redirectUrl = new URL(`${process.env.FRONT_HOST}/login`);
      redirectUrl.searchParams.append("error", err.message);

      return response.redirect(redirectUrl.toString());
    }
  }
}
