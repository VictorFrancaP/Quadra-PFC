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
    console.log("---------------------------------------------------------");
    console.log("[LOG CONTROLLER] Iniciando CreateRefreshTokenController");

    // LOG 1: Ver todos os cookies que chegaram (Isso é crucial!)
    console.log("[LOG CONTROLLER] Headers Cookies:", request.headers.cookie);
    console.log(
      "[LOG CONTROLLER] Request.cookies (Parser):",
      JSON.stringify(request.cookies, null, 2)
    );

    // ATENÇÃO: Verifique se o nome aqui ("RefreshToken") bate com o log acima
    // Às vezes o cookie vem como "refreshToken" (minúscula) e isso quebra tudo.
    const refresh_token = request.cookies["RefreshToken"];

    console.log(
      "[LOG CONTROLLER] Token extraído da chave 'RefreshToken':",
      refresh_token ? "ENCONTRADO" : "UNDEFINED"
    );

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
        console.error("[LOG CONTROLLER] ERRO: refresh_token é nulo ou vazio!");
        throw new RefreshTokenNotFoundError();
      }

      console.log("[LOG CONTROLLER] Token encontrado. Executando UseCase...");

      // usando desestruturação para pegar os dados de token e refreshToken
      const { token, user } = await useCase.execute({
        refreshToken: refresh_token,
      });

      console.log(
        "[LOG CONTROLLER] SUCESSO! Novo token gerado para usuário:",
        user.id
      );
      console.log("---------------------------------------------------------");

      return response.status(200).json({ token, user });
    } catch (err: any) {
      console.error("[LOG CONTROLLER] CAIU NO CATCH:", err);
      console.log("---------------------------------------------------------");

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
