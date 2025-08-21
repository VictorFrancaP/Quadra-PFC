// Importando interface a ser implementada e prismaClient para a manipulação do banco de dados
import { IDeleteUserRepositories } from "../../../domain/repositories/user/IDeleteUserRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class DeleteUserRepository implements IDeleteUserRepositories {
  async deleteUser(id: string): Promise<void> {
    // deletando usuário
    await prismaClient.user.delete({
      where: { id },
    });
  }
}
