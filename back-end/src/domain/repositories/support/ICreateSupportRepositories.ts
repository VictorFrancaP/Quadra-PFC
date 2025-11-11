// Importando entidade Support
import { Support } from "../../entities/Support";

// exportando interface a ser implementada
export interface ICreateSupportRepositories {
  create(support: Support): Promise<Support>;
}
