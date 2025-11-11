// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindRatingsSoccerRepositories } from "../../../domain/repositories/rating/IFindRatingsSoccerRepositories";
import { Rating } from "../../../domain/entities/Rating";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindRatingsSoccerRepository
  implements IFindRatingsSoccerRepositories
{
  async findRatings(soccerId: string): Promise<Rating[]> {
    // procurando avaliações das quadra
    const ratings = await prismaClient.rating.findMany({
      where: { soccerId },
      include: {
        user: {
          select: {
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // retornando dados encontrados
    return ratings.map(
      (r) =>
        new Rating(
          r.rating,
          r.userId,
          r.comments as string,
          r.soccerId as string,
          r.ratedUserId as string,
          r.id
        )
    );
  }
}
