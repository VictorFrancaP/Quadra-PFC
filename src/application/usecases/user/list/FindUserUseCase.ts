// Importando interfaces a serem instânciadas na controller
import {
  IFindUserPartialByEmailRepositories,
  IUserData,
} from "../../../../domain/repositories/user/IFindUserPartialByEmailRepositories";
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";

// Importando interface de dados
import { IFindUserDTO } from "../../../dtos/user/list/IFindUserDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedError } from "../../../../shared/errors/user-error/UserAccessDeniedError";

// exportando usecase
export class FindUserUseCase {
  constructor(
    private readonly findUserPartialByEmailRepository: IFindUserPartialByEmailRepositories,
    private readonly findUserByIdRepository: IFindUserByIdRepositories
  ) {}

  async execute(data: IFindUserDTO): Promise<IUserData> {
    // procurando usuário pelo e-mail
    const userAlreadyExists =
      await this.findUserPartialByEmailRepository.findPartialDataByEmail(
        data.email
      );

    // se não encontrar nenhum usuário, retorna um erro
    if (!userAlreadyExists) {
      throw new UserNotFoundError();
    }

    // verificando se é o admin puxando essas informações
    const isAdmin = await this.findUserByIdRepository.findUserById(data.userId);

    // verificando se vem algum usuário
    if (!isAdmin) {
      throw new UserNotFoundError();
    }

    // verificando se usuário é o admin
    if (isAdmin.role !== "ADMIN") {
      throw new UserAccessDeniedError();
    }

    // retornando usuário
    return userAlreadyExists;
  }
}
