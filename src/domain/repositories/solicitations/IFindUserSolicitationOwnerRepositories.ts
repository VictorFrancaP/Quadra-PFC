// Importando entidade SolicitationOwner para promise(promessa)
import { SolicitationOwner } from "../../entities/SolicitationOwner";

// exportando interface a ser implementada
export interface IFindUserSolicitationOwnerRepositories {
  findSolicitation(userId: string): Promise<SolicitationOwner | null>;
}
