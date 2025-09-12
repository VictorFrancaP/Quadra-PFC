// Importando interface a ser implementada e prismaClient para a manipulação do banco de dados
import { IFindUserResetTokenRepositories } from "../../../domain/repositories/user/IFindUserResetTokenRepositories";
import { User } from "../../../domain/entities/User";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserResetTokenRepository
  implements IFindUserResetTokenRepositories
{
  async findUserToken(resetToken: string): Promise<User | null> {
    // procurando usuário no banco de dados
    const userFind = await prismaClient.user.findFirst({
      where: { resetToken },
    });

    // se não encontrar nenhum usuário, retorna nulo
    if (!userFind) {
      return null;
    }

    // retornando nova entidade de User
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
      userFind.latitude,
      userFind.longitude,
      userFind.id,
      userFind.resetToken,
      userFind.resetTokenExpired,
      userFind.loginAttempts,
      userFind.lockAccount,
      userFind.accountBlock
    );
  }
}
