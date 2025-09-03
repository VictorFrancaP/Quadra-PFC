// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { ICreateOwnerSoccerRepositories } from "../../../domain/repositories/soccer/ICreateOwnerSoccerRepositories";
import { Soccer } from "../../../domain/entities/Soccer";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class CreateOwnerSoccerRepository
  implements ICreateOwnerSoccerRepositories
{
  async createSoccer(soccer: Soccer): Promise<Soccer> {
    // criando quadra no banco de dados
    const createdSoccer = await prismaClient.soccer.create({
      data: {
        name: soccer.name,
        description: soccer.description,
        cep: soccer.cep,
        address: soccer.address,
        city: soccer.city,
        state: soccer.state,
        cnpj: soccer.cnpj,
        fone: soccer.fone,
        operationDays: soccer.operationDays,
        openHour: soccer.openHour,
        closingHour: soccer.closingHour,
        priceHour: soccer.priceHour,
        maxDuration: soccer.maxDuration,
        isActive: soccer.isActive,
        userId: soccer.userId,
        userName: soccer.userName,
        observations: soccer.observations,
      },
    });

    // retornando dados criados em uma entidade
    return new Soccer(
      createdSoccer.name,
      createdSoccer.description,
      createdSoccer.cep,
      createdSoccer.address,
      createdSoccer.city,
      createdSoccer.state,
      createdSoccer.cnpj,
      createdSoccer.fone,
      createdSoccer.operationDays,
      createdSoccer.openHour,
      createdSoccer.closingHour,
      createdSoccer.priceHour,
      createdSoccer.maxDuration,
      createdSoccer.isActive,
      createdSoccer.userId,
      createdSoccer.userName,
      createdSoccer.observations,
      createdSoccer.id
    );
  }
}
