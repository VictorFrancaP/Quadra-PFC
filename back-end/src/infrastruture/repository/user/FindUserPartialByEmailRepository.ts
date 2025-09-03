// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindUserPartialByEmailRepositories } from "../../../domain/repositories/user/IFindUserPartialByEmailRepositories";
import { IUserData } from "../../../domain/repositories/user/IFindUserPartialByEmailRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserPartialByEmailRepository
  implements IFindUserPartialByEmailRepositories
{
  async findPartialDataByEmail(email: string): Promise<IUserData | null> {
    // procurando usuário por e-mail
    const userFind = await prismaClient.user.findFirst({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountBlock: true,
      },
    });

    // se não encontrar nenhum usuário, retorna nulo
    if (!userFind) {
      return null;
    }

    // retornando informações parciais do usuário para o ADMIN
    return userFind;
  }
}
