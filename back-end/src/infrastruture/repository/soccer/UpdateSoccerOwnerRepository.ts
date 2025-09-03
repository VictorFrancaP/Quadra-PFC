// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IUpdateSoccerOwnerRepositories } from "../../../domain/repositories/soccer/IUpdateSoccerOwnerRepositories";
import { Soccer } from "../../../domain/entities/Soccer";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class UpdateSoccerOwnerRepository
  implements IUpdateSoccerOwnerRepositories
{
  async updateSoccer(soccer: Soccer): Promise<void> {
    // mandando informações atualizadas para o banco de dados
    await prismaClient.soccer.update({
      where: { id: soccer.id },
      data: {
        name: soccer.name,
        description: soccer.description,
        cep: soccer.cep,
        address: soccer.address,
        city: soccer.city,
        state: soccer.state,
        fone: soccer.fone,
        operationDays: soccer.operationDays,
        openHour: soccer.openHour,
        closingHour: soccer.closingHour,
        priceHour: soccer.priceHour,
        maxDuration: soccer.maxDuration,
        isActive: soccer.isActive,
        observations: soccer.observations,
      },
    });
  }
}
