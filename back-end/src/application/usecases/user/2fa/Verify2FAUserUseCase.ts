// Importando interface a ser implementadas e a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { ITotpProvider } from "../../../../shared/providers/totp/ITotpProvider";
import { IUpdateUserRepositories } from "../../../../domain/repositories/user/IUpdateUserRepositories";
import { IDeleteManyRefreshTokenRepositories } from "../../../../domain/repositories/refresh-token/IDeleteManyRefreshTokenRepositories";
import { ITokenProvider } from "../../../../shared/providers/tokens/jwt/ITokenProvider";
import { ICreateRefreshTokenRepositories } from "../../../../domain/repositories/refresh-token/ICreateRefreshTokenRepositories";

// Importando interface de dados
import { IVerify2FAUserDTO } from "../../../dtos/user/2fa/IVerify2FAUserDTO";

// Importando interface de resposta
import { IVerify2FAUserResponse } from "../../../dtos/user/2fa/IVerify2FAUserDTO";

// Importando entidade User para a utilização do metodo estatico para atualização
import { User } from "../../../../domain/entities/User";
import { RefreshToken } from "../../../../domain/entities/RefreshToken";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { Verify2FAUserError } from "../../../../shared/errors/user-error/Verify2FAUserError";
import { IncorrectToken2FAUserError } from "../../../../shared/errors/user-error/Verify2FAUserError";

// exportando usecase
export class Verify2FAUserUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly totpProvider: ITotpProvider,
    private readonly updateUserRepository: IUpdateUserRepositories,
    private readonly deleteManyRefreshTokenRepository: IDeleteManyRefreshTokenRepositories,
    private readonly tokenProvider: ITokenProvider,
    private readonly createRefreshTokenRepository: ICreateRefreshTokenRepositories
  ) {}

  async execute(data: IVerify2FAUserDTO): Promise<IVerify2FAUserResponse> {
    // verificando se usuário existe na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verifica se o usuário já logou no sistema e gerou o secret factor aleatorio
    if (!user.twoFactorSecret) {
      throw new Verify2FAUserError();
    }

    // verifica se o token é válido
    const tokenIsValid = this.totpProvider.verifyToken(
      data.token,
      user.twoFactorSecret
    );

    // caso não seja válido, retorna um erro
    if (!tokenIsValid) {
      throw new IncorrectToken2FAUserError();
    }

    // verifica se a autenticação de dois fatores não está ativada
    if (!user.isTwoFactorEnabled) {
      // atualiza os autenticação de dois fatores para ativado
      const updatesUser = User.updateUserInfos(user, {
        isTwoFactorEnabled: true,
      });

      // mandando atualização para o banco de dados
      await this.updateUserRepository.updateUser(updatesUser);
    }

    // deleta todos os refreshTokens vinculados ao usuário
    await this.deleteManyRefreshTokenRepository.deleteManyRefreshToken(
      user.id as string
    );

    // gerando token jwt para acesso ao sistema
    const accessToken = await this.tokenProvider.generateTokenUser({
      id: user.id as string,
      role: user.role,
    });

    // gerando refreshToken para o usuário
    const newRefreshToken = new RefreshToken(user.role, user.id as string);

    // mandando refreshToken para o banco de dados
    const refreshToken =
      await this.createRefreshTokenRepository.createRefreshToken(
        newRefreshToken
      );

    // mandando atualização para a base de dados
    return { accessToken, refreshToken: refreshToken.id as string };
  }
}
