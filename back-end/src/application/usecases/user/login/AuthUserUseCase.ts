// Importando interface a ser interfaces a serem instânciadas na controller
import { IFindUserByEmailRepositories } from "../../../../domain/repositories/user/IFindUserByEmailRepositories";
import { ILockUserAccountRepositories } from "../../../../domain/repositories/user/ILockUserAccountRepositories";
import { ICompareProvider } from "../../../../shared/providers/bcrypt/compare/ICompareProvider";
import { IDayJsProvider } from "../../../../shared/providers/dayjs/IDayJsProvider";
import { IUpdateUserRepositories } from "../../../../domain/repositories/user/IUpdateUserRepositories";
import { IDeleteManyRefreshTokenRepositories } from "../../../../domain/repositories/refresh-token/IDeleteManyRefreshTokenRepositories";
import { ITokenProvider } from "../../../../shared/providers/tokens/jwt/ITokenProvider";
import { ICreateRefreshTokenRepositories } from "../../../../domain/repositories/refresh-token/ICreateRefreshTokenRepositories";

// Importando entidades
import { User } from "../../../../domain/entities/User";
import { RefreshToken } from "../../../../domain/entities/RefreshToken";

// Importando interface de dados
import { IAuthUserDTO } from "../../../dtos/user/login/IAuthUserDTO";
import { IAuthUserResponseDTO } from "../../../dtos/user/login/IAuthUserResponseDTO";

// Importando error personalizados
import { CredentialsUserError } from "../../../../shared/errors/user-error/CredentialsUserError";
import { AccountUserIsLockedError } from "../../../../shared/errors/user-error/AccountUserIsLockedError";
import { AccountUserIsLockedNowError } from "../../../../shared/errors/user-error/AccountUserIsLockedError";
import { AccountUserIsBlockError } from "../../../../shared/errors/user-error/AccountUserIsLockedError";

// exportando classe de usecase
export class AuthUserUseCase {
  // interfaces a serem instânciadas na controller
  constructor(
    private readonly findUserByEmailRepository: IFindUserByEmailRepositories,
    private readonly lockUserAccountRepository: ILockUserAccountRepositories,
    private readonly compareProvider: ICompareProvider,
    private readonly dayJsProvider: IDayJsProvider,
    private readonly updateUserRepository: IUpdateUserRepositories,
    private readonly deleteManyRefreshTokenRepository: IDeleteManyRefreshTokenRepositories,
    private readonly tokenProvider: ITokenProvider,
    private readonly createRefreshTokenRepository: ICreateRefreshTokenRepositories
  ) {}
  // criando função da usecase
  async execute(data: IAuthUserDTO): Promise<IAuthUserResponseDTO> {
    // Verificando se o e-mail já correto
    const userAlreadyExists =
      await this.findUserByEmailRepository.findUserByEmail(data.email);

    // Se usuário não existir, retorna um erro
    if (!userAlreadyExists) {
      throw new CredentialsUserError();
    }

    // Verificando se usuário está bloqueado permanentemente
    if (userAlreadyExists.accountBlock !== false) {
      throw new AccountUserIsBlockError();
    }

    // Verificando se o usuário não está bloqueado temporariamente
    const userIsLocked =
      await this.lockUserAccountRepository.isLockedUserAccount(
        userAlreadyExists
      );

    // Se retornar true, o usuário está bloqueada retorna um erro
    if (userIsLocked) {
      throw new AccountUserIsLockedError();
    }

    // compara as senha digitada com o hash no banco de dados
    const matchPassword = await this.compareProvider.comparePassword(
      data.password,
      userAlreadyExists.password
    );

    // Se retornar false, retorna um erro e acumula um erros com loginAttempts
    if (!matchPassword) {
      // criando variaveis para a contagem de tentativas do usuário
      const attempts = userAlreadyExists.loginAttempts ?? 0;
      const countAttempts = attempts + 1;

      // se as tentivas ultrapassar 5 vezes o usuário é bloqueado
      if (countAttempts >= 5) {
        // se as tentativas ultrapassar 10 vezes a conta é bloqueada permanentemente
        if (countAttempts >= 10) {
          // atualizando informação no banco de dados
          const updatesUser = User.updateUserInfos(userAlreadyExists, {
            accountBlock: true,
          });

          // mandando atualização para o banco de dados
          await this.updateUserRepository.updateUser(updatesUser);
        }
        // tempo de bloqueio de conta
        const isLocked = await this.dayJsProvider.add(30, "minute");

        // atualizando usuário
        const updatesUser = User.updateUserInfos(userAlreadyExists, {
          loginAttempts: countAttempts,
          lockAccount: isLocked,
        });

        // mandando atualização para o banco de dados
        await this.updateUserRepository.updateUser(updatesUser);

        // retornando erro de bloqueio
        throw new AccountUserIsLockedNowError();
      }

      // atualizando quantidade de tentativas
      const updatesUser = User.updateUserInfos(userAlreadyExists, {
        loginAttempts: countAttempts,
      });

      // mandando atualização para o banco de dados
      await this.updateUserRepository.updateUser(updatesUser);

      // retornando erro
      throw new CredentialsUserError();
    }

    // caso a senha o e-mail estejam corretos, atualiza o numero de tentativas para zero
    const updatesUser = User.updateUserInfos(userAlreadyExists, {
      loginAttempts: 0,
    });

    // mandando atualização para o banco de dados
    await this.updateUserRepository.updateUser(updatesUser);

    if (userAlreadyExists.isTwoFactorEnabled) {
      return {
        step: "2fa_required",
        user: {
          name: userAlreadyExists.name,
          id: userAlreadyExists.id as string,
        },
      };
    }

    // deletando todos os refreshTokens associados ao usuário (para gerar um novo)
    await this.deleteManyRefreshTokenRepository.deleteManyRefreshToken(
      userAlreadyExists.id as string
    );

    // gera o jwt de acesso para o usuário
    const token = await this.tokenProvider.generateTokenUser({
      id: userAlreadyExists.id as string,
      role: userAlreadyExists.role,
    });

    // cria um novo refreshToken
    const newRefreshToken = new RefreshToken(
      userAlreadyExists.role,
      userAlreadyExists.id as string
    );

    // criando novo refreshToken no banco de dados
    const refreshToken =
      await this.createRefreshTokenRepository.createRefreshToken(
        newRefreshToken
      );

    // retornando promise(promessa) esperada
    return {
      step: "setup_2fa",
      user: {
        name: userAlreadyExists.name,
        id: userAlreadyExists.id as string,
      },
      token,
      refreshToken: refreshToken.id!,
    };
  }
}
