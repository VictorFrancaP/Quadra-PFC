// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { User } from "../../../domain/entities/User";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserByIdRepository implements IFindUserByIdRepositories {
  async findUserById(id: string): Promise<User | null> {
    // procurando usuário no banco de dados
    const userFind = await prismaClient.user.findFirst({
      where: { id },
    });

    // se não encontrar nenhum usuário, retorna nulo
    if (!userFind) {
      return null;
    }

    // retornando nova entidade com dados encontrados
    return new User(
      userFind.name,
      userFind.email,
      userFind.password,
      userFind.age,
      userFind.role,
      userFind.address,
      userFind.cep,
      userFind.cpf,
      userFind.gender,
      userFind.profileImage,
      userFind.id,
      userFind.resetToken,
      userFind.resetTokenExpired,
      userFind.loginAttempts,
      userFind.lockAccount,
      userFind.accountBlock
    );
  }
}
