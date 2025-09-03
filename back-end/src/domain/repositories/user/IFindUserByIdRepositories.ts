// Importando entidade User para promise(promessa)
import { User } from "../../entities/User";

// Importando interface a ser implementada
export interface IFindUserByIdRepositories {
  findUserById(id: string): Promise<User | null>;
}
