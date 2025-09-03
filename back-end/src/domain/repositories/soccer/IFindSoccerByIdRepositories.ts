// Importando entidade Soccer para promise(promessa)
import { Soccer } from "../../entities/Soccer";

// exportando interface a ser implementada
export interface IFindSoccerByIdRepositories {
  findSoccerById(id: string): Promise<Soccer | null>;
}
