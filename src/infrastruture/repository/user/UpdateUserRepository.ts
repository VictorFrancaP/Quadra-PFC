// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IUpdateUserRepositories } from "../../../domain/repositories/user/IUpdateUserRepositories";
import { prismaClient } from "../../database/db";
import { User } from "../../../domain/entities/User";

// exportando classe de implementação de interface
export class UpdateUserRepository implements IUpdateUserRepositories {
  async updateUser(user: User): Promise<void> {
    // atualizando informações do usuário
    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        password: user.password,
        age: user.age,
        role: user.role,
        address: user.address,
        cep: user.cep,
        profileImage: user.profileImage,
        resetToken: user.resetToken,
        resetTokenExpired: user.resetExpiredToken,
        loginAttempts: user.loginAttempts,
        lockAccount: user.lockAccount,
        accountBlock: user.accountBlock,
      },
    });
  }
}
