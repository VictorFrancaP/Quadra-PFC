// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindUserRatingsRepositories } from "../../../domain/repositories/rating/IFindUserRatingsRepositories";
import { Rating } from "../../../domain/entities/Rating";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserRatingsRepository implements IFindUserRatingsRepositories {
  async findUserRatings(userId: string): Promise<Rating[] | null> {
    // procurando ratings das quadras
    const ratings = await prismaClient.rating.findMany({
      where: { ratedUserId: userId },
    });

    // caso não encontre nada, retorna nulo
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
