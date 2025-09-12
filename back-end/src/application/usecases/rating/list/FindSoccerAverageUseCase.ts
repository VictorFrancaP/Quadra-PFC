// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindSoccerRatingRepositories } from "../../../../domain/repositories/rating/IFindSoccerRatingsRepositories";

// Importando interface de dados
import { IFindSoccerRatingDTO } from "../../../dtos/rating/list/IFindSoccerRatingDTO";

// exportando usecase
export class FindSoccerAverageUseCase {
  constructor(
    private readonly findSoccerRatingRepository: IFindSoccerRatingRepositories
  ) {}

  async execute(data: IFindSoccerRatingDTO): Promise<number> {
    // procurando quadras avaliadas
    const ratings = await this.findSoccerRatingRepository.findSoccerRatings(
      data.soccerId
    );

    // caso não encontre nada, retorna zero
    if (!ratings || !ratings.length) return 0;

    // pegando media da avaliação
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);

    // retornando média
    return sum / ratings.length;
  }
}
