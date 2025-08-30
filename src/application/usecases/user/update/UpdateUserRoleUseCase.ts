// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IUpdateUserRepositories } from "../../../../domain/repositories/user/IUpdateUserRepositories";

// Importando interface de dados
import { IUpdateUserRoleDTO } from "../../../dtos/user/update/IUpdateUserRoleDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/UserNotFoundError";
import { UserAccessDeniedRoleUpdateError } from "../../../../shared/errors/UserAccessDeniedError";
import { UserAccessDeniedRoleSameError } from "../../../../shared/errors/UserAccessDeniedError";

// Importando entidade User para utilização do metodo estatico
import { User } from "../../../../domain/entities/User";

// exportando usecase
export class UpdateUserRoleUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly updateUserRepository: IUpdateUserRepositories
  ) {}

  async execute(data: IUpdateUserRoleDTO): Promise<void> {
    // procurando usuário que está fazendo a solicitação
    const userRequested = await this.findUserByIdRepository.findUserById(
      data.userId
    );

    // verificando se usuário existe na base de dados, se não existir retorna um erro
    if (!userRequested) {
      throw new UserNotFoundError();
    }

    // verificando se é o ADMIN
    if (userRequested.role !== "ADMIN") {
      throw new UserAccessDeniedRoleUpdateError();
    }

    // procurando usuário para edição de permissão
    const user = await this.findUserByIdRepository.findUserById(data.id);

    // caso o usuário não existe, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando usuário é ADMIN ou OWNER
    if (user.role === "ADMIN" || user.role === "OWNER") {
      throw new UserAccessDeniedRoleSameError();
    }

    // mandando atualização para o metodo estatico
    const updatesUser = User.updateUserInfos(user, {
      role: data.newRole,
    });

    // mandando usuário atualizado para o banco de dados
    return await this.updateUserRepository.updateUser(updatesUser);
  }
}
