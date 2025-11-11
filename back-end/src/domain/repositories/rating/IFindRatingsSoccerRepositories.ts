// Importando entidade Rating para ser uma promise(promessa)
import { Rating } from "../../entities/Rating";

// exportando interface a ser implementada
export interface IFindRatingsSoccerRepositories {
  findRatings(soccerId: string): Promise<Rating[]>;
}
