// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IProfileUserRepositories } from "../../../domain/repositories/user/IProfileUserRepositories";
import { IProfileRequest } from "../../../domain/repositories/user/IProfileUserRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class ProfileUserRepository implements IProfileUserRepositories {
  async viewProfile(userId: string): Promise<IProfileRequest | null> {
    // buscando informações do usuário
    const userProfile = await prismaClient.user.findFirst({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        age: true,
        address: true,
        cep: true,
        cpf: true,
        gender: true,
        profileImage: true,
        id: true,
      },
    });

    // se não encontrar dados, retorna um erro
    if (!userProfile) {
      return null;
    }

    // retornando dados
    return userProfile;
  }
}
