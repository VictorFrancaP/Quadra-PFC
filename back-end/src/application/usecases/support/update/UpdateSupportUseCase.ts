// Importando interfaces a serem implementadas e instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSupportByIdRepositories } from "../../../../domain/repositories/support/IFindSupportByIdRepositories";
import { IUpdateSupportRepositories } from "../../../../domain/repositories/support/IUpdateSupportRepositories";

// Importando interface de dados
import { IUpdateSupportDTO } from "../../../dtos/support/update/IUpdateSupportDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedError } from "../../../../shared/errors/user-error/UserAccessDeniedError";
import { SupportNotFoundError } from "../../../../shared/errors/support-error/SupportNotFoundError";

// Importando entidade Support para utilização de metodo de atualização estatico
import { Support } from "../../../../domain/entities/Support";

// exportando usecase
export class UpdateSupportUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSupportByIdRepository: IFindSupportByIdRepositories,
    private readonly updateSupportRepository: IUpdateSupportRepositories
  ) {}

  async execute(data: IUpdateSupportDTO): Promise<void> {
    // procurando usuário na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não encontre, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando o usuário é ADMIN
    if (user.role !== "ADMIN") {
      throw new UserAccessDeniedError();
    }

    // procurando suporte na base de dados
    const support = await this.findSupportByIdRepository.findSupport(data.id);

    // caso não encontre, retorna um erro
    if (!support) {
      throw new SupportNotFoundError();
    }

    // chamando metodo estatico para atualização
    const updatesSupport = Support.updateSupport(support, {
      status: data.newStatus,
    });

    // mandando atualização para o banco de dados
    return await this.updateSupportRepository.updateStatus(updatesSupport);
  }
}
