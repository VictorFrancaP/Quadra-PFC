// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindUserOwnersRepositories } from "../../../domain/repositories/user/IFindUserOwnersRepositories";
import { usersOwners } from "../../../domain/repositories/user/IFindUserOwnersRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserOwnersRepository implements IFindUserOwnersRepositories {
  async findUserOwners(): Promise<usersOwners[]> {
    // procurando OWNER(PROPRIETÁRIOS) na base de dados
    const usersOwners = await prismaClient.user.findMany({
      where: { role: "OWNER" },
      select: {
        id: true,
        email: true,
      },
    });

    // retornando dados encontrados
    return usersOwners;
  }
}
