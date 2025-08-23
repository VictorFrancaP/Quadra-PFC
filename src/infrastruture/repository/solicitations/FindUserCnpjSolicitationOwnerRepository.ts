// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindUserCnpjSolicitationOwnerRepositories } from "../../../domain/repositories/solicitations/IFindUserCnpjSolicitationOwnerRepositories";
import { IFindCnpjRequest } from "../../../domain/repositories/solicitations/IFindUserCnpjSolicitationOwnerRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserCnpjSolicitationOwnerRepository
  implements IFindUserCnpjSolicitationOwnerRepositories
{
  async findUserCnpj(cnpj: string): Promise<IFindCnpjRequest | null> {
    // buscando cnpj na solicitation
    const userCnpjSolicitation = await prismaClient.solicitationOwner.findFirst(
      {
        where: { cnpj },
        select: {
          userId: true,
          cnpj: true,
        },
      }
    );

    // caso não encontre, retorna nulo
    if (!userCnpjSolicitation) {
      return null;
    }

    // retornando entidade com os dados encontrados
    return userCnpjSolicitation;
  }
}
