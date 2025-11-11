import { IFindSoccerRatingsRepositories } from "../../../../domain/repositories/rating/IFindSoccerRatingsRepositories";
import { IFindSoccerRatingRepositories } from "../../../../domain/repositories/rating/IFindSoccerRatingRepositories";
import { IFindSoccerRatingDTO } from "../../../dtos/rating/list/IFindSoccerRatingDTO";

export interface IFindSoccerAverageResponse {
  average: number;
  hasRated: boolean;
}

export class FindSoccerAverageUseCase {
  constructor(
    private readonly findSoccerRatingsRepository: IFindSoccerRatingsRepositories,
    private readonly findSoccerRatingRepository: IFindSoccerRatingRepositories
  ) {}

  async execute(
    data: IFindSoccerRatingDTO
  ): Promise<IFindSoccerAverageResponse> {
    // buscar todas as avaliações da quadra
    const ratings = await this.findSoccerRatingsRepository.findSoccerRatings(
      data.soccerId
    );

    // verificar se o usuário já avaliou
    const existingRating =
      await this.findSoccerRatingRepository.findSoccerRating(
        data.userId,
        data.soccerId
      );

    const hasRated = !!existingRating;

    // se não houver avaliações, retorna média 0
    if (!ratings || ratings.length === 0) {
      return {
        average: 0,
        hasRated,
      };
    }

    // calcular média
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / ratings.length;

    // retornar objeto completo
    return {
      average,
      hasRated,
    };
  }
}
