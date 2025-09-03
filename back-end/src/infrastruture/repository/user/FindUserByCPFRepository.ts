// Importando interface a ser implementada nesta classe e prismaClient
import {
  IDatasUserVisible,
  IFindUserByCPFRepositories,
} from "../../../domain/repositories/user/IFindUserByCPFRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserByCPFRepository implements IFindUserByCPFRepositories {
  async findUserByCPF(cpf: string): Promise<IDatasUserVisible | null> {
    // verificando se o CPF está vinculado a algum usuário
    const userFind = await prismaClient.user.findFirst({
      where: { cpf },
      select: {
        name: true,
        email: true,
        age: true,
        role: true,
        id: true,
      }
    });

    // se não encontrar nenhum usuário associado ao CPF, retorna nulo
    if (!userFind) {
      return null;
    }

    // retornando nova entidade de User 
    return userFind;
  }
}
