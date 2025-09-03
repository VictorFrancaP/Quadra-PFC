// Importando interface a serem instânciadas na controller
import { IProfileUserRepositories } from "../../../../domain/repositories/user/IProfileUserRepositories";

// Importando Promise(promessa)
import { IProfileRequest } from "../../../../domain/repositories/user/IProfileUserRepositories";

// Importando interface de dados
import { IProfileUserDTO } from "../../../dtos/user/list/IProfileUserDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedError } from "../../../../shared/errors/user-error/UserAccessDeniedError";

// exportando usecase
export class ProfileUserUseCase {
  constructor(
    private readonly profileUserRepository: IProfileUserRepositories
  ) {}

  async execute(data: IProfileUserDTO): Promise<IProfileRequest> {
    // buscando informações do usuário no banco de dados
    const userAlreadyExists = await this.profileUserRepository.viewProfile(
      data.userId
    );

    // se não encontrar nenhum usuário, retorna um erro
    if (!userAlreadyExists) {
      throw new UserNotFoundError();
    }

    // Se encontrar validamos se o userId do usuário autenticado é igual o userId passado, retorna um erro
    if (userAlreadyExists.id !== data.userId) {
      throw new UserAccessDeniedError();
    }

    // retornar informações do usuário
    return userAlreadyExists;
  }
}
