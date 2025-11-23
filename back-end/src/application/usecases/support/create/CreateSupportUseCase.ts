// Importando interfaces a serem implementadas e instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindUserSupportRepositories } from "../../../../domain/repositories/support/IFindUserSupportRepositories";
import { ICreateSupportRepositories } from "../../../../domain/repositories/support/ICreateSupportRepositories";

// Importando interface de dados
import { ICreateSupportDTO } from "../../../dtos/support/create/ICreateSupportDTO";

// Importando entidade Support para ser uma promise(promessa)
import { Support } from "../../../../domain/entities/Support";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { SupportFoundError } from "../../../../shared/errors/support-error/SupportFoundError";
import { SupportNotFoundError } from "../../../../shared/errors/support-error/SupportNotFoundError";

// exportando usecase
export class CreateSupportUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findUserSupportRepository: IFindUserSupportRepositories,
    private readonly createSupportRepository: ICreateSupportRepositories
  ) {}

  async execute(data: ICreateSupportDTO): Promise<Support> {
    // procurando usuário na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando o usuário ja fez um chamado de support
    const supports = await this.findUserSupportRepository.findUserSupport(
      user.email
    );

    // caso não encontre, retorna um erro
    if (!supports?.length) {
      throw new SupportNotFoundError();
    }

    // procurando suporte com o status open
    const statusSupport = supports
      .filter((support) => support.status === "OPEN")
      .every(Boolean);

    // caso encontre retorna um erro
    if (statusSupport) {
      throw new SupportFoundError();
    }

    // criando instância da entidade Support
    const newSupport = new Support(
      user.id as string,
      user.email,
      data.subject,
      data.message,
      "OPEN"
    );

    // criando chamado do support no banco de dados
    return await this.createSupportRepository.create(newSupport);
  }
}
