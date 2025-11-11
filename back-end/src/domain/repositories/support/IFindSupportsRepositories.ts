// Importando entidade Support
import { Support } from "../../entities/Support";

// exportando interface a ser implementada
export interface IFindSupportsRepositories {
  findSupports(): Promise<Support[]>;
}
