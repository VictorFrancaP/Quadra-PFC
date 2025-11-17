// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { ICreateSupportRepositories } from "../../../domain/repositories/support/ICreateSupportRepositories";
import { Support } from "../../../domain/entities/Support";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class CreateSupportRepository implements ICreateSupportRepositories {
  async create(support: Support): Promise<Support> {
    // criando chamado no banco de dados
    const createSupport = await prismaClient.support.create({
      data: {
        subject: support.subject,
        message: support.message,
        status: support.status,
        userId: support.userId,
        userEmail: support.userEmail,
      },
    });

    // retornando dados criados
    return new Support(
      createSupport.userId,
      createSupport.userEmail,
      createSupport.subject,
      createSupport.message,
      createSupport.status,
      createSupport.id,
      createSupport.created_at
    );
  }
}
