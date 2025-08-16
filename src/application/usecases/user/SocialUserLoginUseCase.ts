// Importando interfaces a serem instânciadas na controller
import { IFindUserByEmailRepositories } from "../../../domain/repositories/user/IFindUserByEmailRepositories";
import { ICreateUserRepositories } from "../../../domain/repositories/user/ICreateUserRepositories";
import { ITokenProvider } from "../../../shared/providers/tokens/jwt/ITokenProvider";
import { IDeleteManyRefreshTokenRepositories } from "../../../domain/repositories/refresh-token/IDeleteManyRefreshTokenRepositories";
import { ICreateRefreshTokenRepositories } from "../../../domain/repositories/refresh-token/ICreateRefreshTokenRepositories";

// Importando interface de dados
import { ISocialUserLoginDTO } from "../../dtos/user/ISocialUserLoginDTO";

// Importando response da Promise(promessa)
import { IAuthUserResponseDTO } from "../../dtos/user/IAuthUserResponseDTO";

// Importando entidade de RefreshToken para usuário
import { RefreshToken } from "../../../domain/entities/RefreshToken";

// exportando classe de usecase
export class SocialUserLoginUseCase {
  constructor(
    private readonly findUserByEmailRepository: IFindUserByEmailRepositories,
    private readonly createUserRepository: ICreateUserRepositories,
    private readonly tokenProvider: ITokenProvider,
    private readonly deleteManyRefreshTokenRepository: IDeleteManyRefreshTokenRepositories,
    private readonly createRefreshTokenRepository: ICreateRefreshTokenRepositories
  ) {}

  async execute(data: ISocialUserLoginDTO): Promise<IAuthUserResponseDTO> {
    // verificando se este e-mail já foi cadastrado
    let userAlreadyExists =
      await this.findUserByEmailRepository.findUserByEmail(data.email);

    // se o usuário não tiver cadastro a conta é criado
    if (!userAlreadyExists) {
      userAlreadyExists = await this.createUserRepository.createUser({
        name: data.name,
        email: data.email,
        password: "",
        age: 0,
        role: "USER",
        address: "",
        cep: "",
        cpf: "",
        gender: "NOTINFORM",
        profileImage: data.profileImage,
        resetToken: null,
        resetExpiredToken: null,
        loginAttempts: 0,
        lockAccount: null,
        accountBlock: false,
      });
    }

    // deletando refreshTokens associados ao usuário
    await this.deleteManyRefreshTokenRepository.deleteManyRefreshToken(
      userAlreadyExists.id as string
    );

    // gere o token jwt para o usuário
    const token = await this.tokenProvider.generateTokenUser({
      id: userAlreadyExists.id as string,
      role: userAlreadyExists.role,
    });

    // criando um novo refreshToken
    const newRefreshToken = new RefreshToken(
      userAlreadyExists.role,
      userAlreadyExists.id as string
    );

    // mandando refreshToken para o banco de dados
    const refreshToken =
      await this.createRefreshTokenRepository.createRefreshToken(
        newRefreshToken
      );

    // retornando dados esperados
    return {
      name: userAlreadyExists.name,
      token,
      refreshToken: refreshToken.id!,
    };
  }
}
