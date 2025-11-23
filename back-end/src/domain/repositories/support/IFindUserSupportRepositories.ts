// Importando entidade Support
import { Support } from "../../entities/Support";

// exportando interface a ser implementada
export interface IFindUserSupportRepositories {
  findUserSupport(userEmail: string): Promise<Support[] | null>;
}
