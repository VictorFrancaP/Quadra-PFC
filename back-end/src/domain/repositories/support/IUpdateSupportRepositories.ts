// Importando entidade Support para um parameter
import { Support } from "../../entities/Support";

// exportando interface a ser implementada
export interface IUpdateSupportRepositories {
  updateStatus(support: Support): Promise<void>;
}
