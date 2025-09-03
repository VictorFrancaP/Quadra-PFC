// Importando entidade User para ser um parametro para a função
import { User } from "../../entities/User";

// exportando interface a ser implementada
export interface IUpdateUserRepositories {
  updateUser(user: User): Promise<void>;
}
