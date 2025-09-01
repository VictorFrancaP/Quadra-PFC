// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindCnpjOwnerSoccerRepositories } from "../../../domain/repositories/soccer/IFindCnpjOwnerSoccerRepositories";
import { IFindCnpjOwnerSoccerRequest } from "../../../domain/repositories/soccer/IFindCnpjOwnerSoccerRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindCnpjOwnerSoccerRepository
  implements IFindCnpjOwnerSoccerRepositories
{
  async findCnpjOwner(
    cnpj: string
  ): Promise<IFindCnpjOwnerSoccerRequest[] | null> {
    // procurando quadras cadastradas com o cnpj
    const findSoccers = await prismaClient.soccer.findMany({
      where: { cnpj },
      select: {
        cnpj: true,
        userId: true,
      },
    });

    // caso não encontre nada, retorna nulo
    if (!findSoccers.length) {
      return null;
    }

    // retornando dados encontrados
    return findSoccers;
  }
}
