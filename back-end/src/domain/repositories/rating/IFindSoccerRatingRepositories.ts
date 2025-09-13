// Importando entidade Rating para ser uma promise(promessa)
import { Rating } from "../../entities/Rating";

// exportando interface a ser implementada
export interface IFindSoccerRatingRepositories {
  findSoccerRating(userId: string, soccerId: string): Promise<Rating | null>;
}
