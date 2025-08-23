// Importando interfaces a serem instânciando na controller
import { IFindUserSolicitationOwnerRepositories } from "../../../domain/repositories/solicitations/IFindUserSolicitationOwnerRepositories";
import { IFindUserCnpjSolicitationOwnerRepositories } from "../../../domain/repositories/solicitations/IFindUserCnpjSolicitationOwnerRepositories";
import { ICreateSolicitationOwnerRepositories } from "../../../domain/repositories/solicitations/ICreateSolicitationOwnerRepositories";

// Importando interface de dados
import { ICreateSolicitationOwnerDTO } from "../../dtos/solicitations/ICreateSolicitationOwnerDTO";

// Importando entidade SolicitationOwner para promise(promessa)
import { SolicitationOwner } from "../../../domain/entities/SolicitationOwner";

// Importando error personalizado
import { SolicitationAlreadyExists } from "../../../shared/errors/SolicitationAlreadyExistsError";
import { cnpjSolicitationOwnerAlreadyExistsError } from "../../../shared/errors/SolicitationAlreadyExistsError";

// exportando usecase
export class CreateSolicitationOwnerUseCase {
  constructor(
    private readonly findUserSolicitationOwnerRepository: IFindUserSolicitationOwnerRepositories,
    private readonly findUserCnpjSolicitationOwnerRepository: IFindUserCnpjSolicitationOwnerRepositories,
    private readonly createSolicitationOwnerRepository: ICreateSolicitationOwnerRepositories
  ) {}

  async execute(data: ICreateSolicitationOwnerDTO): Promise<SolicitationOwner> {
    // verificando se usuário já efetuou uma solicitação
    const isUserSolicitation =
      await this.findUserSolicitationOwnerRepository.findSolicitation(
        data.userId
      );

    // se encontrar uma solicitação, retorna um erro
    if (isUserSolicitation) {
      throw new SolicitationAlreadyExists();
    }

    // verificando se cnpj não foi utilizado
    const cnpjUser =
      await this.findUserCnpjSolicitationOwnerRepository.findUserCnpj(
        data.cnpj
      );

    // caso encontre algum cnpj retorna um erro
    if (cnpjUser) {
      throw new cnpjSolicitationOwnerAlreadyExistsError();
    }

    // criando entidade de solicitação
    const newSolicitationOwner = new SolicitationOwner(
      data.localName,
      data.description,
      data.cnpj,
      data.fone,
      false,
      data.userId
    );

    // criando nova solicitação no banco de dados
    const createSolicitation =
      await this.createSolicitationOwnerRepository.createSolicitation(
        newSolicitationOwner
      );

    // retornando solicitação criada
    return createSolicitation;
  }
}
