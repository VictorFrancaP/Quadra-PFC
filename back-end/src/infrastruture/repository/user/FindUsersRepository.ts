// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindUsersRepositories } from "../../../domain/repositories/user/IFindUsersRepositories";
import { IUsersRequest } from "../../../domain/repositories/user/IFindUsersRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação da interface
export class FindUsersRepository implements IFindUsersRepositories {
  async findUsersMany(): Promise<IUsersRequest[] | null> {
    // procurando usuários no banco de dados
    const users = await prismaClient.user.findMany({
      select: {
        name: true,
        email: true,
        role: true,
        accountBlock: true,
        id: true,
      },
    });

    // caso não encontre nenhum usuário
    if (!users.length) {
      return null;
    }

    // retornando informações dos usuários
    return users;
  }
}
