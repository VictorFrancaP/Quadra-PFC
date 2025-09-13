// Importando entidade Rating para ser uma promise(promessa)
import { Rating } from "../../entities/Rating";

// exportando interface a ser implementada
export interface IFindUserRatingRepositories {
  findUserRating(userId: string, ratedUserId: string): Promise<Rating | null>;
}
