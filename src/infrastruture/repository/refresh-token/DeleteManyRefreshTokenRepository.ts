// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IDeleteManyRefreshTokenRepositories } from "../../../domain/repositories/refresh-token/IDeleteManyRefreshTokenRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class DeleteManyRefreshTokenRepository
  implements IDeleteManyRefreshTokenRepositories
{
  async deleteManyRefreshToken(userId: string): Promise<void> {
    // deletando todos os refreshTokens vinculados ao usuário
    await prismaClient.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
