// Importando entidade Rating para ser promise(promessa)
import { Rating } from "../../entities/Rating";

// exportando interface a ser implementada
export interface IFindSoccerRatingRepositories {
  findSoccerRatings(soccerId: string): Promise<Rating[] | null>;
}
