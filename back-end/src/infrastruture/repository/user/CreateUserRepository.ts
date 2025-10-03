// Importando interface a ser implementada e prismaClient para manipulação do banco de dados
import { ICreateUserRepositories } from "../../../domain/repositories/user/ICreateUserRepositories";
import { User } from "../../../domain/entities/User";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de inteface
export class CreateUserRepository implements ICreateUserRepositories {
  async createUser(user: User): Promise<User> {
    // criando usuário no banco de dados
    const createdUser = await prismaClient.user.create({
      data: {
        // atributos obrigatórios
        name: user.name,
        email: user.email.toLowerCase(),
        password: user.password,
        age: user.age,
        role: user.role,
        address: user.address,
        cep: user.cep,
        cpf: user.cpf,
        gender: user.gender,

        // atributos opcionais
        latitude: user.latitude,
        longitude: user.longitude,
        profileImage: user.profileImage,
        resetToken: null,
        resetTokenExpired: null,
        loginAttempts: 0,
        lockAccount: null,
        twoFactorSecret: null,
        isTwoFactorEnabled: false,
        accountBlock: false,
      },
    });

    // retornando nova entidade
    return new User(
      createdUser.name,
      createdUser.email,
      createdUser.password,
      createdUser.age,
      createdUser.role,
      createdUser.address,
      createdUser.cep,
      createdUser.cpf,
      createdUser.gender,
      createdUser.profileImage,
      createdUser.latitude,
      createdUser.longitude,
      createdUser.id,
      createdUser.resetToken,
      createdUser.resetTokenExpired,
      createdUser.loginAttempts,
      createdUser.lockAccount,
      createdUser.twoFactorSecret,
      createdUser.isTwoFactorEnabled,
      createdUser.accountBlock
    );
  }
}
