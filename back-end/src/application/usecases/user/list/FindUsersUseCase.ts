// Importando interface a serem instânciadas na controller
import { IFindUsersRepositories } from "../../../../domain/repositories/user/IFindUsersRepositories";
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";

// Importando interface de dados
import { IFindUsersDTO } from "../../../dtos/user/list/IFindUsersDTO";

// Importando promise(promessa)
import { IUsersRequest } from "../../../../domain/repositories/user/IFindUsersRepositories";

// Importando error personalizado
import { UsersNotFoundError } from "../../../../shared/errors/user-error/UserFoundError";
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { UsersAccessDeniedError } from "../../../../shared/errors/user-error/UserAccessDeniedError";

// exportando usecase
export class FindUsersUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findUsersRepository: IFindUsersRepositories
  ) {}

  async execute(data: IFindUsersDTO): Promise<IUsersRequest[]> {
    // procurando informações do admin (pra ver se é realmente o ADMIN)
    const usersCredentials = await this.findUserByIdRepository.findUserById(
      data.userId
    );

    // se não encontrar o usuário que está fazendo esta requisição, retorna um erro
    if (!usersCredentials) {
      throw new UserNotFoundError();
    }

    // verificando se o usuário é realmente admin
    if (usersCredentials.role !== "ADMIN") {
      throw new UsersAccessDeniedError();
    }

    // buscando usuários no banco de dados
    const users = await this.findUsersRepository.findUsersMany();

    // se não encontrar nenhum usuário, retorna um erro
    if (!users || users.length === 0) {
      throw new UsersNotFoundError();
    }

    // retornando usuários
    return users;
  }
}
