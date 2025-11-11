// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IFindUserSupportRepositories } from "../../../domain/repositories/support/IFindUserSupportRepositories";
import { Support } from "../../../domain/entities/Support";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserSupportRepository implements IFindUserSupportRepositories {
  async findUserSupport(userId: string): Promise<Support | null> {
    // procurando suporte do usuário
    const support = await prismaClient.support.findFirst({
      where: { userId },
    });

    // caso não encontre, retorna nulo
    if (!support) {
      return null;
    }

    // retornando dados encontrados
    return new Support(
      support.userId,
      support.subject,
      support.message,
      support.status,
      support.id
    );
  }
}
