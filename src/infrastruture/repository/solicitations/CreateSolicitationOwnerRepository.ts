// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { ICreateSolicitationOwnerRepositories } from "../../../domain/repositories/solicitations/ICreateSolicitationOwnerRepositories";
import { SolicitationOwner } from "../../../domain/entities/SolicitationOwner";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class CreateSolicitationOwnerRepository
  implements ICreateSolicitationOwnerRepositories
{
  async createSolicitation(
    solicitation: SolicitationOwner
  ): Promise<SolicitationOwner> {
    // cria solicitação no banco de dados
    const createSolicitation = await prismaClient.solicitationOwner.create({
      data: {
        localName: solicitation.localName,
        description: solicitation.description,
        cnpj: solicitation.cnpj,
        fone: solicitation.fone,
        approved: solicitation.approved,
        userId: solicitation.userId,
      },
    });

    // retornando dados em uma nova entidade
    return new SolicitationOwner(
      createSolicitation.localName,
      createSolicitation.description,
      createSolicitation.cnpj,
      createSolicitation.fone,
      createSolicitation.approved,
      createSolicitation.userId,
      createSolicitation.id
    );
  }
}
