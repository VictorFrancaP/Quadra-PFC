// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindUserCnpjOrderRepositories } from "../../../domain/repositories/order/IFindUserCnpjOrderRepositories";
import { IFindUserOrderRequest } from "../../../domain/repositories/order/IFindUserCnpjOrderRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserCnpjOrderRepository
  implements IFindUserCnpjOrderRepositories
{
  async findUserCnpj(cnpj: string): Promise<IFindUserOrderRequest | null> {
    // procurando cnpj nas solicitações
    const userCnpjAlreadyExists = await prismaClient.order.findFirst({
      where: { cnpj },
      select: {
        cnpj: true,
        userId: true,
      },
    });

    // caso não encontre nada, retorna nulo
    if (!userCnpjAlreadyExists) {
      return null;
    }

    // retornando dados encontrados
    return userCnpjAlreadyExists;
  }
}
