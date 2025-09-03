// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { ICreateRefreshTokenRepositories } from "../../../domain/repositories/refresh-token/ICreateRefreshTokenRepositories";
import { RefreshToken } from "../../../domain/entities/RefreshToken";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class CreateRefreshTokenRepository
  implements ICreateRefreshTokenRepositories
{
  async createRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken> {
    // criando refreshToken no banco de dados
    const createdRefreshToken = await prismaClient.refreshToken.create({
      data: {
        userRole: refreshToken.userRole,
        userId: refreshToken.userId,
      },
    });

    // retornando nova entidade
    return new RefreshToken(
      createdRefreshToken.userRole,
      createdRefreshToken.userId,
      createdRefreshToken.id
    );
  }
}
