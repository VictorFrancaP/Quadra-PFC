// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindUserRatingRepositories } from "../../../domain/repositories/rating/IFindUserRatingRepositories";
import { Rating } from "../../../domain/entities/Rating";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserRatingRepository implements IFindUserRatingRepositories {
  async findUserRating(
    userId: string,
    ratedUserId: string
  ): Promise<Rating | null> {
    // procurando se usuário já fez uma avaliação ao usuário
    const ratingUserRated = await prismaClient.rating.findFirst({
      where: { userId, ratedUserId },
    });

    // se não encontrar, retorna nulo
    if (!ratingUserRated) {
      return null;
    }

    // retornando dados encontrados
    return ratingUserRated as Rating;
  }
}
