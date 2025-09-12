// Importando interface implementadas a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccersRepositories } from "../../../../domain/repositories/soccer/IFindSoccersRepositories";
import { IOpenRouteProvider } from "../../../../shared/providers/open-route-service/IOpenRouteProvider";

// Importando interface de dados
import { IFindNearbySoccerDTO } from "../../../dtos/soccer/list/IFindNearbySoccerDTO";

// Importando Soccer para ser uma promise
import { Soccer } from "../../../../domain/entities/Soccer";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { UserLatLgnNotFoundError } from "../../../../shared/errors/user-error/AddUserProfileInfoError";
import { SoccersNotFoundError } from "../../../../shared/errors/soccer-error/SoccersNotFoundError";

// exportando usecase
export class FindNearbySoccerUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccersRepository: IFindSoccersRepositories,
    private readonly openRouteProvider: IOpenRouteProvider
  ) {}

  async execute(data: IFindNearbySoccerDTO): Promise<Soccer[]> {
    // procurando usuário logado na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não encontre nenhum usuário, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando se o usuário não possui latitude e longitude
    if (user.latitude === null || user.longitude === null) {
      throw new UserLatLgnNotFoundError();
    }

    // pegando latitude e longitude do usuário
    const origin = { latitude: user.latitude, longitude: user.longitude };

    // buscando quadras na base de dados
    const soccers = await this.findSoccersRepository.findSoccers();

    // caso não tenha nenhuma quadra, retorna um erro
    if (!soccers || !soccers.length) {
      throw new SoccersNotFoundError();
    }

    // calculando distância real da quadra
    const soccersDistance = await Promise.all(
      soccers.map(async (soccer) => {
        // pegando distancia em Km
        const distanceKm = await this.openRouteProvider.calculateDistance(
          [origin.latitude!, origin.longitude!],
          [soccer.latitude!, soccer.longitude!]
        );

        // retornando quadra
        return { ...soccer, distancia: distanceKm };
      })
    );

    // filtrando por distância maxima
    const limit = data.distanciaMaximaKm || 10;
    const filters = soccersDistance.filter(
      (soccer) => soccer.distancia! <= limit
    );

    // ordenando por distância
    return filters.sort((a, b) => a.distancia! - b.distancia!);
  }
}
