// Importando interfaces a serem implementadas e a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { ITotpProvider } from "../../../../shared/providers/totp/ITotpProvider";
import { IUpdateUserRepositories } from "../../../../domain/repositories/user/IUpdateUserRepositories";

// Importando interface de dados e resposta
import { ISetup2FAUserDTO } from "../../../dtos/user/2fa/ISetup2FAUserDTO";
import { ISetup2FAUserResponseDTO } from "../../../dtos/user/2fa/ISetup2FAUserDTO";

// Importando entidade User para a utilização do método estático
import { User } from "../../../../domain/entities/User";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { Setup2FAUserError } from "../../../../shared/errors/user-error/Setup2FAUserError";

// exportando usecase
export class Setup2FAUserUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly totpProvider: ITotpProvider,
    private readonly updateUserRepository: IUpdateUserRepositories
  ) {}

  async execute(
    data: ISetup2FAUserDTO
  ): Promise<ISetup2FAUserResponseDTO> {
    // verificando se usuário existe na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // caso a autenticação de dois fatores esteja ativa, retorna um erro para o front-end (autenticação já ativa)
    if (user.isTwoFactorEnabled) {
      throw new Setup2FAUserError();
    }

    // gera a secret factor aleatoria e o QRCode
    const { secret, otpAuthUrl } = this.totpProvider.generateSecret(user.email);

    // utilizando o metodo estatico da entidade User para mandar a atualização para a base de dados
    const updatesUser = User.updateUserInfos(user, {
      twoFactorSecret: secret,
    });

    // mandando atualização para a base de dados
    await this.updateUserRepository.updateUser(updatesUser);

    // retornando QRCode para o usuário cadastrar o dois fatores
    return { otpAuthUrl };
  }
}
