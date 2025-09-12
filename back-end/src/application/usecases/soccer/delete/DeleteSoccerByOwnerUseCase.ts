// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IDeleteSoccerByOwnerRepositories } from "../../../../domain/repositories/soccer/IDeleteSoccerByOwnerRepositories";

// Importando interface de dados
import { IDeleteSoccerOwnerDTO } from "../../../dtos/soccer/delete/IDeleteSoccerDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { SoccerAccessDeniedDeleteError } from "../../../../shared/errors/soccer-error/SoccerAccessDeniedError";

// exportando usecase
export class DeleteSoccerByOwnerUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly deleteSoccerByOwnerRepository: IDeleteSoccerByOwnerRepositories
  ) {}

  async execute(data: IDeleteSoccerOwnerDTO): Promise<void> {
    // procurando usuário que está fazendo a requisição
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso o usuário não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando se usuário é OWNER
    if (user.role !== "OWNER") {
      throw new SoccerAccessDeniedDeleteError();
    }

    // deletando quadra do usuário
    return await this.deleteSoccerByOwnerRepository.deleteSoccerByOwner(
      data.userId
    );
  }
}
