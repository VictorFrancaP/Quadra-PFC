// Importando entidade Soccer para ser promise(promessa)
import { Soccer } from "../../entities/Soccer";

// exportando interface a ser implementada
export interface IFindSoccerOwnerRepositories {
  findSoccerOwner(userId: string): Promise<Soccer | null>;
}
