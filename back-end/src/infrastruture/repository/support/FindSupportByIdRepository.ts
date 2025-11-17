// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindSupportByIdRepositories } from "../../../domain/repositories/support/IFindSupportByIdRepositories";
import { Support } from "../../../domain/entities/Support";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindSupportByIdRepository implements IFindSupportByIdRepositories {
  async findSupport(id: string): Promise<Support | null> {
    // procurando suporte na base dados
    const support = await prismaClient.support.findFirst({
      where: { id },
    });

    // caso não encontre, retorna nulo
    if (!support) {
      return null;
    }

    // retornando dados encontrados
    return new Support(
      support.userId,
      support.userEmail,
      support.subject,
      support.message,
      support.status,
      support.id,
      support.created_at
    );
  }
}
