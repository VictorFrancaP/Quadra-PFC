// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IFindSupportsRepositories } from "../../../domain/repositories/support/IFindSupportsRepositories";
import { Support } from "../../../domain/entities/Support";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindSupportsRepository implements IFindSupportsRepositories {
  async findSupports(): Promise<Support[]> {
    // procurando todos os suportes na base de dados
    const supports = await prismaClient.support.findMany({
      orderBy: { created_at: "desc" },
    });

    // retornando dados encontrados
    return supports.map(
      (support) =>
        new Support(
          support.userId,
          support.subject,
          support.message,
          support.status,
          support.id
        )
    );
  }
}
