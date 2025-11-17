// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IUpdateSupportRepositories } from "../../../domain/repositories/support/IUpdateSupportRepositories";
import { Support } from "../../../domain/entities/Support";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class UpdateSupportRepository implements IUpdateSupportRepositories {
  async updateStatus(support: Support): Promise<void> {
    // mandando atualização para o banco de dados
    await prismaClient.support.update({
      where: { id: support.id },
      data: {
        status: support.status,
      },
    });
  }
}
