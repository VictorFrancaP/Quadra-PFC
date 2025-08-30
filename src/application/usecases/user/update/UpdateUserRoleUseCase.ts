// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindUserOrderRepositories } from "../../../../domain/repositories/order/IFindUserOrderRepositories";
import { IUpdateUserRepositories } from "../../../../domain/repositories/user/IUpdateUserRepositories";

// Importando interface de dados
import { IUpdateUserRoleDTO } from "../../../dtos/user/update/IUpdateUserRoleDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/UserNotFoundError";
import { UserAccessDeniedRoleUpdateError } from "../../../../shared/errors/UserAccessDeniedError";
import { UserAccessDeniedRoleSameError } from "../../../../shared/errors/UserAccessDeniedError";
import {
  UserOrderNotApprovedError,
  UserOrderNotFoundError,
} from "../../../../shared/errors/UserOrderError";

// Importando entidade User para utilização do metodo estatico
import { User } from "../../../../domain/entities/User";

// exportando usecase
export class UpdateUserRoleUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findUserOrderRepository: IFindUserOrderRepositories,
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

    // verificando se usuário contém uma solicitação
    const userOrder = await this.findUserOrderRepository.findUserOrder(
      user.id as string
    );

    // verificando se existe a solicitação
    if (!userOrder) {
      throw new UserOrderNotFoundError();
    }

    // verificando se a solicitação foi aprovada
    if (userOrder.status !== "APPROVED") {
      throw new UserOrderNotApprovedError();
    }

    // mandando atualização para o metodo estatico
    const updatesUser = User.updateUserInfos(user, {
      role: data.newRole,
    });

    // mandando usuário atualizado para o banco de dados
    return await this.updateUserRepository.updateUser(updatesUser);
  }
}
