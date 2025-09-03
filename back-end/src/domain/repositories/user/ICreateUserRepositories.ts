// Importando entidade user para ser uma Promise(promessa)
import { User } from "../../entities/User";

// exportando interface a ser implementada na infrastruture (repository)
export interface ICreateUserRepositories {
  createUser(user: User): Promise<User>;
}
