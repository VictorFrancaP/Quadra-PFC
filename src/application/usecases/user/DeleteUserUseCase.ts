// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IDeleteUserRepositories } from "../../../domain/repositories/user/IDeleteUserRepositories";

// Importando interface de dados
import { IDeleteUserDTO } from "../../dtos/user/IDeleteUserDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/UserNotFoundError";
import { UserDeletedAccessDeniedError } from "../../../shared/errors/UserAccessDeniedError";

// exportando usecase
export class DeleteUserUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly deleteUserRepository: IDeleteUserRepositories
  ) {}

  async execute(data: IDeleteUserDTO): Promise<void> {
    // procurando usuário pelo id
    const userAlreadyExists = await this.findUserByIdRepository.findUserById(
      data.userId
    );

    // caso não encontre nenhum usuário, retorna um erro
    if (!userAlreadyExists) {
      throw new UserNotFoundError();
    }

    // deletando usuario no banco de dados
    return await this.deleteUserRepository.deleteUser(
      userAlreadyExists.id as string
    );
  }
}
