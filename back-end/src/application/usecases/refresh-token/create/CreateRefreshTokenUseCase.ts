// Importando interfaces a serem instânciadas na controller
import { IFindUserRefreshTokenRepositories } from "../../../../domain/repositories/refresh-token/IFindUserRefreshTokenRepositories";
import { ITokenProvider } from "../../../../shared/providers/tokens/jwt/ITokenProvider";
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";

// Importando interface de response DTO e dados
import { IRefreshTokenResponseDTO } from "../../../dtos/refresh-token/IRefreshTokenResponseDTO";
import { IRefreshTokenDTO } from "../../../dtos/refresh-token/IRefreshTokenDTO";

// Importando classe de error personalizada
import { RefreshTokenNotFoundError } from "../../../../shared/errors/refresh-token-error/RefreshTokenNotFoundError";
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";

// exportando usecase
export class CreateRefreshTokenUseCase {
  constructor(
    private readonly findUserRefreshTokenRepository: IFindUserRefreshTokenRepositories,
    private readonly tokenProvider: ITokenProvider,
    private readonly findUserByIdRepository: IFindUserByIdRepositories
  ) {}

  async execute(data: IRefreshTokenDTO): Promise<IRefreshTokenResponseDTO> {
    // verificando se refreshToken existe
    const refreshTokenAlreadyExists =
      await this.findUserRefreshTokenRepository.findUserRefreshToken(
        data.refreshToken
      );
    
      // caso não exista, retorna um erro
    if (!refreshTokenAlreadyExists) {
      throw new RefreshTokenNotFoundError();
    }

    // procurando usuário
    const user = await this.findUserByIdRepository.findUserById(
      refreshTokenAlreadyExists.userId
    );

    // caso o usuário não seja encontrado, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    } 

    // retornando token de acesso
    const token = await this.tokenProvider.generateTokenUser({
      id: user.id as string,
      role: user.role,
    });

    return { token, user };
  }
}
