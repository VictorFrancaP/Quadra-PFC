// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindSoccerRatingRepositories } from "../../../domain/repositories/rating/IFindSoccerRatingRepositories";
import { Rating } from "../../../domain/entities/Rating";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindSoccerRatingRepository
  implements IFindSoccerRatingRepositories
{
  async findSoccerRating(
    userId: string,
    soccerId: string
  ): Promise<Rating | null> {
    // verificando se usuário já realizou uma avaliação para a quadra
    const ratingUserSoccer = await prismaClient.rating.findFirst({
      where: { userId, soccerId },
    });

    // caso não encontre nada, retorna nulo
    if (!ratingUserSoccer) {
      return null;
    }

    // retornando dados encontrados
    return ratingUserSoccer as Rating;
  }
}
