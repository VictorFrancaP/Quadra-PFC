// Importando interfaces a serem instânciadas na controller
import { IFindSoccersRepositories } from "../../../domain/repositories/soccer/IFindSoccersRepositories";
import { IDecryptData } from "../../../shared/providers/aes/decrypt/IDecryptData";

// Importando entidade Soccer para ser a promise(promessa)
import { Soccer } from "../../../domain/entities/Soccer";

// Importando error personalizado
import { SoccersNotFoundError } from "../../../shared/errors/soccer-error/SoccersNotFoundError";

// exportando usecase
export class FindSoccersUseCase {
  constructor(
    private readonly findSoccersRepository: IFindSoccersRepositories,
    private readonly decryptData: IDecryptData
  ) {}

  async execute(): Promise<Soccer[]> {
    // procurando quadras cadastradas no sistema
    const soccers = await this.findSoccersRepository.findSoccers();

    // caso não encontre, retorna um erro
    if (!soccers || !soccers.length) {
      throw new SoccersNotFoundError();
    }

    // criando constante com os dados armazenados
    const soccersFind = await Promise.all(
      soccers.map(
        async (soccer) =>
          new Soccer(
            soccer.name,
            soccer.description,
            soccer.cep,
            soccer.address,
            soccer.city,
            soccer.state,
            await this.decryptData.decrypted(soccer.cnpj),
            await this.decryptData.decrypted(soccer.fone),
            soccer.operationDays,
            soccer.openHour,
            soccer.closingHour,
            soccer.priceHour,
            soccer.maxDuration,
            soccer.isActive,
            soccer.userId,
            soccer.userName,
            soccer.observations,
            soccer.id
          )
      )
    );

    // retornando dados
    return soccersFind;
  }
}
