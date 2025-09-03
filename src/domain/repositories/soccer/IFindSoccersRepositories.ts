// Importando entidade Soccer para promise(promessa)
import { Soccer } from "../../entities/Soccer";

// exportando interface a ser implementada
export interface IFindSoccersRepositories {
  findSoccers(): Promise<Soccer[] | null>;
}
