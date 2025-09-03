// Importando entidade Soccer para ser um parametro
import { Soccer } from "../../entities/Soccer";

// exportando interface a ser implementada
export interface IUpdateSoccerOwnerRepositories {
  updateSoccer(soccer: Soccer): Promise<void>;
}
