// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindCepSoccerRepositories } from "../../../domain/repositories/soccer/IFindCepSoccerRepositories";
import { IFindCepSoccerRequest } from "../../../domain/repositories/soccer/IFindCepSoccerRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindCepSoccerRepository implements IFindCepSoccerRepositories {
  async findCepSoccer(cep: string): Promise<IFindCepSoccerRequest | null> {
    // procurando cep na base de dados
    const findSoccer = await prismaClient.soccer.findFirst({
      where: { cep },
      select: {
        cep: true,
        userId: true,
      },
    });

    // caso não encontre nada, retorna nulo
    if (!findSoccer) {
      return null;
    }

    // retornando dados encontrados
    return findSoccer;
  }
}
