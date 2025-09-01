// Importando interfaces a serem instânciadas na controller
import { IFindUserRefreshTokenRepositories } from "../../../domain/repositories/refresh-token/IFindUserRefreshTokenRepositories";
import { ITokenProvider } from "../../../shared/providers/tokens/jwt/ITokenProvider";

// Importando interface de response DTO e dados
import { IRefreshTokenResponseDTO } from "../../dtos/refresh-token/IRefreshTokenResponseDTO";
import { IRefreshTokenDTO } from "../../dtos/refresh-token/IRefreshTokenDTO";

// Importando classe de error personalizada
import { RefreshTokenNotFoundError } from "../../../shared/errors/refresh-token-error/RefreshTokenNotFoundError";

// Importando entidade do RefreshToken para criação
import { RefreshToken } from "../../../domain/entities/RefreshToken";

// exportando usecase
export class CreateRefreshTokenUseCase {
  // interfaces a serem instânciadas na controller
  constructor(
    private readonly findUserRefreshTokenRepository: IFindUserRefreshTokenRepositories,
    private readonly tokenProvider: ITokenProvider
  ) {}

  // criando função
  async execute(data: IRefreshTokenDTO): Promise<IRefreshTokenResponseDTO> {
    // verificando se refreshToken existe
    const refreshTokenAlreadyExists =
      await this.findUserRefreshTokenRepository.findUserRefreshToken(
        data.refreshToken
      );

    // se não existir, retorna um erro
    if (!refreshTokenAlreadyExists) {
      throw new RefreshTokenNotFoundError();
    }

    //gerando token jwt para o usuário
    const token = await this.tokenProvider.generateTokenUser({
      id: refreshTokenAlreadyExists.userId,
      role: refreshTokenAlreadyExists.userRole,
    });

    // retornando dados esperados
    return { token };
  }
}
