// Importando interfaces implementadas a serem instânciadas na controller
import { IFindUserRatingsRepositories } from "../../../../domain/repositories/rating/IFindUserRatingsRepositories";

// Importando interface de dados
import { IFindUserRatingDTO } from "../../../dtos/rating/list/IFindUserRatingDTO";

// exportando usecase
export class FindUserAverageUseCase {
  constructor(
    private readonly findUserRatingRepository: IFindUserRatingsRepositories
  ) {}

  async execute(data: IFindUserRatingDTO): Promise<number> {
    // procurando usuários com ratings
    const ratings = await this.findUserRatingRepository.findUserRatings(
      data.userId
    );

    // caso não encontre nada, retorna zero
    if (!ratings || !ratings.length) return 0;

    // pegando media da avaliação
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);

    // retornando média
    return sum / ratings.length;
  }
}
