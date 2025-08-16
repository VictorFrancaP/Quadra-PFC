// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindUserRefreshTokenRepositories } from "../../../domain/repositories/refresh-token/IFindUserRefreshTokenRepositories";
import { RefreshToken } from "../../../domain/entities/RefreshToken";
import { prismaClient } from "../../database/db";

// exportando classe de implementação da interface
export class FindUserRefreshTokenRepository
  implements IFindUserRefreshTokenRepositories
{
  async findUserRefreshToken(
    refreshToken: string
  ): Promise<RefreshToken | null> {
    // procurando o refreshToken no banco de dados
    const refreshTokenFind = await prismaClient.refreshToken.findFirst({
      where: { id: refreshToken },
    });

    // se não encontrar o refreshToken, retorna um erro
    if (!refreshTokenFind) {
      return null;
    }

    // retornando novo RefreshToken
    return new RefreshToken(
      refreshTokenFind.userRole,
      refreshTokenFind.userId,
      refreshTokenFind.id
    );
  }
}
