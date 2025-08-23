// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IFindUserSolicitationOwnerRepositories } from "../../../domain/repositories/solicitations/IFindUserSolicitationOwnerRepositories";
import { SolicitationOwner } from "../../../domain/entities/SolicitationOwner";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserSolicitationOwnerRepository
  implements IFindUserSolicitationOwnerRepositories
{
  async findSolicitation(userId: string): Promise<SolicitationOwner | null> {
    // buscando solicitação do proprietario
    const userSolicitation = await prismaClient.solicitationOwner.findFirst({
      where: { userId },
    });

    // se não encontrar solicitação, retorna nulo
    if (!userSolicitation) {
      return null;
    }

    // retornando entidade com os dados encontrados
    return new SolicitationOwner(
      userSolicitation.localName,
      userSolicitation.description,
      userSolicitation.cnpj,
      userSolicitation.fone,
      userSolicitation.approved,
      userSolicitation.userId,
      userSolicitation.id
    );
  }
}
