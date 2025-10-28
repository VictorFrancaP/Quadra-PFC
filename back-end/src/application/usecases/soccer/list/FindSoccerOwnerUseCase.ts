// Importando interfaces a serem implementadas e instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccerOwnerRepositories } from "../../../../domain/repositories/soccer/IFindSoccerOwnerRepositories";
import { IDecryptData } from "../../../../shared/providers/aes/decrypt/IDecryptData";

// Importando interface de dados
import { IFindOwnerSoccerDTO } from "../../../dtos/soccer/list/IFindOwnerSoccerDTO";

// Importando entidade Soccer para ser uma promise(promessa)
import { Soccer } from "../../../../domain/entities/Soccer";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { SoccerAccessDeniedViewError } from "../../../../shared/errors/soccer-error/SoccerAccessDeniedError";
import { SoccerNotFoundError } from "../../../../shared/errors/soccer-error/SoccerNotFoundError";

// exportando usecase
export class FindSoccerOwnerUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerOwnerRepository: IFindSoccerOwnerRepositories,
    private readonly decryptData: IDecryptData
  ) {}

  async execute(data: IFindOwnerSoccerDTO): Promise<Soccer> {
    // procurando usuário na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não encontre, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando se usuário é proprietário
    if (user.role !== "OWNER") {
      throw new SoccerAccessDeniedViewError();
    }

    // procurando quadra do proprietário
    const soccer = await this.findSoccerOwnerRepository.findSoccerOwner(
      user.id as string
    );

    // caso não encontre, retorna um erro
    if (!soccer) {
      throw new SoccerNotFoundError();
    }

    // desescriptografando dados
    const cnpj = await this.decryptData.decrypted(soccer.cnpj);
    const fone = await this.decryptData.decrypted(soccer.fone);

    // instânciando entidade
    const ownerSoccer = new Soccer(
      soccer.name,
      soccer.description,
      soccer.cep,
      soccer.address,
      soccer.city,
      soccer.state,
      cnpj,
      fone,
      soccer.operationDays,
      soccer.openHour,
      soccer.closingHour,
      soccer.priceHour,
      soccer.maxDuration,
      soccer.isActive,
      soccer.userId,
      soccer.userName,
      soccer.images,
      soccer.latitude,
      soccer.longitude,
      soccer.ownerPixKey,
      soccer.observations,
      soccer.id
    );

    // retornando dados
    return ownerSoccer;
  }
}
