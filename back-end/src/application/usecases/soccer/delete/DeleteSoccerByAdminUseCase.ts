// Importando interface a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccerByIdRepositories } from "../../../../domain/repositories/soccer/IFindSoccerByIdRepositories";
import { IDeleteSoccerByAdminRepositories } from "../../../../domain/repositories/soccer/IDeleteSoccerByAdminRepositories";

// Importando interface de dados
import { IDeleteSoccerAdminDTO } from "../../../dtos/soccer/delete/IDeleteSoccerDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import {
  SoccerAccessDeniedDeleteError,
  SoccerAccessDeniedError,
} from "../../../../shared/errors/soccer-error/SoccerAccessDeniedError";
import { SoccerNotFoundError } from "../../../../shared/errors/soccer-error/SoccerNotFoundError";

// exportando usecase
export class DeleteSoccerByAdminUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerByIdRepository: IFindSoccerByIdRepositories,
    private readonly deleteSoccerByAdminRepository: IDeleteSoccerByAdminRepositories
  ) {}

  async execute(data: IDeleteSoccerAdminDTO): Promise<void> {
    // procurando usuário que está fazendo a requisição
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não encontre nenhum usuário, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando se o usuário é ADMIN
    if (user.role !== "ADMIN") {
      throw new SoccerAccessDeniedError();
    }

    // procurando quadra
    const soccer = await this.findSoccerByIdRepository.findSoccerById(data.id);

    // caso a quadra não exista, retorna um erro
    if (!soccer) {
      throw new SoccerNotFoundError();
    }

    // verificando se quadra está ativa, caso esteja o ADMIN deverá consultar o PROPRIETARIO para deletar a quadra
    if (soccer.isActive !== false) {
      throw new SoccerAccessDeniedDeleteError();
    }

    // deletando quadra PELO ID
    return await this.deleteSoccerByAdminRepository.deleteSoccerByAdmin(
      soccer.id as string
    );
  }
}
