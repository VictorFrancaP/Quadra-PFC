// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IDeleteSoccerByAdminRepositories } from "../../../domain/repositories/soccer/IDeleteSoccerByAdminRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class DeleteSoccerByAdminRepository
  implements IDeleteSoccerByAdminRepositories
{
  async deleteSoccerByAdmin(id: string): Promise<void> {
    // deletando quadra por id
    await prismaClient.soccer.delete({
      where: { id },
    });
  }
}
