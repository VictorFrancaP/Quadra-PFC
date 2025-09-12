// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { ICreateRatingRepositories } from "../../../domain/repositories/rating/ICreateRatingRepositories";
import { Rating } from "../../../domain/entities/Rating";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class CreateRatingRepository implements ICreateRatingRepositories {
  async createRating(rating: Rating): Promise<Rating> {
    // criando rating na base de dados
    const createRating = await prismaClient.rating.create({
      data: {
        rating: rating.rating,
        comments: rating.comments ?? undefined,
        userId: rating.userId,
        soccerId: rating.soccerId ?? undefined,
        ratedUserId: rating.ratedUserId ?? undefined,
      },
    });

    // retornando dados criados em nova entidade
    return new Rating(
      createRating.rating,
      createRating.userId,
      createRating.comments ?? undefined,
      createRating.soccerId ?? undefined,
      createRating.ratedUserId ?? undefined,
      createRating.id
    );
  }
}
