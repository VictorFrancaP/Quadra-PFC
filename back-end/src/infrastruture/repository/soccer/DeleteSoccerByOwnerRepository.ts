// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IDeleteSoccerByOwnerRepositories } from "../../../domain/repositories/soccer/IDeleteSoccerByOwnerRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class DeleteSoccerByOwnerRepository
  implements IDeleteSoccerByOwnerRepositories
{
  async deleteSoccerByOwner(userId: string): Promise<void> {
    // deletando quadra do OWNER(PROPRIETÁRIO)
    await prismaClient.soccer.delete({
      where: { userId },
    });
  }
}
