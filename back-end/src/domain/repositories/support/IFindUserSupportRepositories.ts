// Importando entidade Support
import { Support } from "../../entities/Support";

// exportando interface a ser implementada
export interface IFindUserSupportRepositories {
  findUserSupport(userId: string): Promise<Support | null>;
}
