// Importando interfaces a serem implementadas e instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccerByIdRepositories } from "../../../../domain/repositories/soccer/IFindSoccerByIdRepositories";
import { IFindSoccerRatingRepositories } from "../../../../domain/repositories/rating/IFindSoccerRatingsRepositories";
import { FindSoccerAverageUseCase } from "../../../usecases/rating/list/FindSoccerAverageUseCase";
import { IDecryptData } from "../../../../shared/providers/aes/decrypt/IDecryptData";

// Importando interface de dados
import { IFindSoccerDTO } from "../../../dtos/soccer/list/IFindSoccerDTO";

// Importando entidade Soccer para ser promise(promessa)
import { Soccer } from "../../../../domain/entities/Soccer";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../../shared/errors/soccer-error/SoccerNotFoundError";

// exportando interface de resposta
export interface ISoccerWithRating extends Soccer {
  averageRating: number;
  ratingCount: number;
}

// exportando usecase
export class FindSoccerUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerByIdRepository: IFindSoccerByIdRepositories,
    private readonly decryptData: IDecryptData,
    private readonly findSoccerAverageUseCase: FindSoccerAverageUseCase,
    private readonly findSoccerRatingRepository: IFindSoccerRatingRepositories
  ) {}

  async execute(data: IFindSoccerDTO): Promise<Soccer> {
    // verificando se o usuário existe, na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando se quadra existe, na base de dados
    const soccer = await this.findSoccerByIdRepository.findSoccerById(
      data.soccerId
    );

    // caso não exista, retorna um erro
    if (!soccer) {
      throw new SoccerNotFoundError();
    }

    // descriptografando dados
    const cnpj = await this.decryptData.decrypted(soccer.cnpj);
    const fone = await this.decryptData.decrypted(soccer.fone);

    const ratings = await this.findSoccerRatingRepository.findSoccerRatings(
      soccer.id as string
    );
    const ratingCount = ratings ? ratings.length : 0;

    // 2. Calcula a média (usando o UseCase que você já criou/definiu)
    const averageRating = await this.findSoccerAverageUseCase.execute({
      soccerId: soccer.id as string,
    });

    const soccerDetails: ISoccerWithRating = {
      ...soccer,
      cnpj,
      fone,
      averageRating,
      ratingCount,
    };

    // retornando dados
    return soccerDetails;
  }
}
