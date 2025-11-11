// Importando interfaces a serem implementadas e instãnciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccerByIdRepositories } from "../../../../domain/repositories/soccer/IFindSoccerByIdRepositories";
import { IFindRatingsSoccerRepositories } from "../../../../domain/repositories/rating/IFindRatingsSoccerRepositories";

// Importando interface de dados
import { IFindRatingsSoccerDTO } from "../../../dtos/rating/list/IFindRatingsSoccerDTO";

// Importando entidade Rating para ser uma promise(promessa)
import { Rating } from "../../../../domain/entities/Rating";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../../shared/errors/soccer-error/SoccerNotFoundError";

// exportando usecase
export class FindRatingsSoccerUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerByIdRepository: IFindSoccerByIdRepositories,
    private readonly findRatingsSoccerRepository: IFindRatingsSoccerRepositories
  ) {}

  async execute(data: IFindRatingsSoccerDTO): Promise<Rating[]> {
    // procurando usuário na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // procurando a quadra existente
    const soccer = await this.findSoccerByIdRepository.findSoccerById(
      data.soccerId
    );

    // caso não exista, retorna um erro
    if (!soccer) {
      throw new SoccerNotFoundError();
    }

    // procurando avaliações
    const ratings = await this.findRatingsSoccerRepository.findRatings(
      soccer.id as string
    );

    // retornando dados encontrados
    return ratings;
  }
}
