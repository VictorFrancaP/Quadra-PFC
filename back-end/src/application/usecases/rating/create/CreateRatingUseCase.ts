// Importando interfaces implementadas a serem instânciadas na controller
import { ICreateRatingRepositories } from "../../../../domain/repositories/rating/ICreateRatingRepositories";

// Importando entidade Rating para ser uma promise(promessa)
import { Rating } from "../../../../domain/entities/Rating";

// Importando interface de dados
import { ICreateRatingDTO } from "../../../dtos/rating/create/ICreateRatingDTO";

// exportando usecase
export class CreateRatingUseCase {
  constructor(
    private readonly createRatingRepository: ICreateRatingRepositories
  ) {}

  async execute(data: ICreateRatingDTO): Promise<Rating> {
    // criando rating em nova entidade
    const newRating = new Rating(
      data.rating,
      data.userId,
      data.comments,
      data.soccerId,
      data.ratedUserId
    );

    // mandando dados para o banco de dados
    return await this.createRatingRepository.createRating(newRating);
  }
}
