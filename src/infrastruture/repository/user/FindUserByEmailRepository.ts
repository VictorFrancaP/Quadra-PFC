// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindUserByEmailRepositories } from "../../../domain/repositories/user/IFindUserByEmailRepositories";
import { User } from "../../../domain/entities/User";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserByEmailRepository implements IFindUserByEmailRepositories {
  async findUserByEmail(email: string): Promise<User | null> {
    // procurando e-mail no banco de dados
    const userFindByEmail = await prismaClient.user.findUnique({
      where: { email },
    });

    // se não encontrar nenhum usuário associado ao e-mail, retorna nulo
    if (!userFindByEmail) {
      return null;
    }

    // se encontrar retorna uma nova entidade
    return new User(
      userFindByEmail.name,
      userFindByEmail.email,
      userFindByEmail.password,
      userFindByEmail.age,
      userFindByEmail.role,
      userFindByEmail.address,
      userFindByEmail.cep,
      userFindByEmail.cpf,
      userFindByEmail.gender,
      userFindByEmail.profileImage!,
      userFindByEmail.id,
      userFindByEmail.resetToken,
      userFindByEmail.resetTokenExpired,
      userFindByEmail.loginAttempts,
      userFindByEmail.lockAccount,
      userFindByEmail.accountBlock
    );
  }
}
