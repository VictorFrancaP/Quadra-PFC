// Importando entidade para a ser promise (promessa)
import { Soccer } from "../../entities/Soccer";

// exportando interface a ser implementada
export interface ICreateOwnerSoccerRepositories {
  createSoccer(soccer: Soccer): Promise<Soccer>;
}
