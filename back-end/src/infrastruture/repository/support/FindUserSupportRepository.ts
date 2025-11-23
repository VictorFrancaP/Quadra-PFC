// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IFindUserSupportRepositories } from "../../../domain/repositories/support/IFindUserSupportRepositories";
import { Support } from "../../../domain/entities/Support";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserSupportRepository implements IFindUserSupportRepositories {
  async findUserSupport(userEmail: string): Promise<Support[] | null> {
    // procurando suporte do usuário
    const supports = await prismaClient.support.findMany({
      where: { userEmail },
    });

    // caso não encontre, retorna nulo
    if (!supports.length) {
      return null;
    }

    // retornando dados encontrados
    return supports.map(
      (support) =>
        new Support(
          support.userId,
          support.userEmail,
          support.subject,
          support.message,
          support.status,
          support.id,
          support.created_at
        )
    );
  }
}
