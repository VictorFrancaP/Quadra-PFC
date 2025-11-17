// Importando interfaces a serem implementadas e instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSupportsRepositories } from "../../../../domain/repositories/support/IFindSupportsRepositories";

// Importando interface de dados
import { IFindSupportsDTO } from "../../../dtos/support/list/IFindSupportsDTO";

// Importando entidade Support para ser uma promise(promessa)
import { Support } from "../../../../domain/entities/Support";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedError } from "../../../../shared/errors/user-error/UserAccessDeniedError";

// exportando usecase
export class FindSupportsUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSupportsRepository: IFindSupportsRepositories
  ) {}

  async execute(data: IFindSupportsDTO): Promise<Support[]> {
    // procurando usuário na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não encontre, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando se o usuário é ADMIN
    if (user.role !== "ADMIN") {
      throw new UserAccessDeniedError();
    }

    // procurando todos os supports
    const supports = await this.findSupportsRepository.findSupports();

    // retornando dados encontrados
    return supports;
  }
}
