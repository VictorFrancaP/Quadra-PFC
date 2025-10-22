// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IDeleteManyRefreshTokenRepositories } from "../../../../domain/repositories/refresh-token/IDeleteManyRefreshTokenRepositories";

// Importando interface de dados
import { ILogoutUserDTO } from "../../../dtos/user/logout/ILogoutUserDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";

// exportando usecase
export class LogoutUserUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly deleteManyRefreshTokenRepository: IDeleteManyRefreshTokenRepositories
  ) {}

  async execute(data: ILogoutUserDTO): Promise<void> {
    // verificando se usuário exista, na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não encontre nada, retorna erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // deletando refreshTokens vinculados
    await this.deleteManyRefreshTokenRepository.deleteManyRefreshToken(
      user.id as string
    );
  }
}
