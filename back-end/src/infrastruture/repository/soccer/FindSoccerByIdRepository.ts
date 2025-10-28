// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IFindSoccerByIdRepositories } from "../../../domain/repositories/soccer/IFindSoccerByIdRepositories";
import { Soccer } from "../../../domain/entities/Soccer";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindSoccerByIdRepository implements IFindSoccerByIdRepositories {
  async findSoccerById(id: string): Promise<Soccer | null> {
    // procurando quadra pelo id
    const soccer = await prismaClient.soccer.findFirst({
      where: { id },
    });

    // caso não encontre, nada retorna um nulo
    if (!soccer) {
      return null;
    }

    // retornando dados encontrados, em uma nova entidade
    return new Soccer(
      soccer.name,
      soccer.description,
      soccer.cep,
      soccer.address,
      soccer.city,
      soccer.state,
      soccer.cnpj,
      soccer.fone,
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
  }
}
