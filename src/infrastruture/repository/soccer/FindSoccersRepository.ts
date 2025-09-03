// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IFindSoccersRepositories } from "../../../domain/repositories/soccer/IFindSoccersRepositories";
import { Soccer } from "../../../domain/entities/Soccer";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindSoccersRepository implements IFindSoccersRepositories {
  async findSoccers(): Promise<Soccer[] | null> {
    // procurando quadras cadastradas no sistema
    const soccers = await prismaClient.soccer.findMany();

    // caso não encontre nada, retorna nulo
    if (!soccers.length) {
      return null;
    }

    // retornando dados encontrados
    return soccers.map(
      (soccer) =>
        new Soccer(
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
          soccer.observations,
          soccer.id
        )
    );
  }
}
