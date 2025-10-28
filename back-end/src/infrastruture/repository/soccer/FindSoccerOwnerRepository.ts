// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindSoccerOwnerRepositories } from "../../../domain/repositories/soccer/IFindSoccerOwnerRepositories";
import { Soccer } from "../../../domain/entities/Soccer";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindSoccerOwnerRepository implements IFindSoccerOwnerRepositories {
  async findSoccerOwner(userId: string): Promise<Soccer | null> {
    // procurando quadra por id do usuário proprietário
    const soccer = await prismaClient.soccer.findFirst({
      where: { userId },
    });

    // caso não exista, retorna nulo
    if (!soccer) {
      return null;
    }

    // retornando dados encontrados em uma nova entidade
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
