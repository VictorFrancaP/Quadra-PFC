// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindSoccerRatingsRepositories } from "../../../domain/repositories/rating/IFindSoccerRatingsRepositories";
import { Rating } from "../../../domain/entities/Rating";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindSoccerRatingsRepository
  implements IFindSoccerRatingsRepositories
{
  async findSoccerRatings(soccerId: string): Promise<Rating[] | null> {
    // procurando ratings das quadras
    const ratings = await prismaClient.rating.findMany({
      where: { soccerId: soccerId },
    });

    // caso não encontre, retorna nulo
    if (!ratings) {
      return null;
    }

    // retornando dados encontrados
    return ratings.map(
      (r) =>
        new Rating(
          r.rating,
          r.userId,
          r.comments ?? undefined,
          r.soccerId ?? undefined,
          r.ratedUserId ?? undefined,
          r.id
        )
    );
  }
}
