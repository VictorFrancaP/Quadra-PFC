// Importando entidade Support para ser uma promise(promessa)
import { Support } from "../../entities/Support";

// exportando interface a ser implementada
export interface IFindSupportByIdRepositories {
  findSupport(id: string): Promise<Support | null>;
}
