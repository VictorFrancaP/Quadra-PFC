// Importando interfaces a serem implementadas e instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindUserSupportRepositories } from "../../../../domain/repositories/support/IFindUserSupportRepositories";

// Importando interface de dados
import { IFindSupportUserDTO } from "../../../dtos/support/list/IFindSupportUserDTO";

// Importando entidade Support para ser uma promise(promessa)
import { Support } from "../../../../domain/entities/Support";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { SupportNotFoundError } from "../../../../shared/errors/support-error/SupportNotFoundError";

// exportando usecase
export class FindSupportUserUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findUserSupportRepository: IFindUserSupportRepositories
  ) {}

  async execute(data: IFindSupportUserDTO): Promise<Support> {
    // procurando usuário na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // procurando chamado do suporte do usuário
    const userSupport = await this.findUserSupportRepository.findUserSupport(
      user.email
    );

    // caso não exista, retorna um erro
    if (!userSupport) {
      throw new SupportNotFoundError();
    }

    // retornando dados encontrados
    return userSupport;
  }
}
