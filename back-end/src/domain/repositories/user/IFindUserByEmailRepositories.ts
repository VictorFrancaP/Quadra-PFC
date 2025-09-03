// Importando entidade User para ser uma Promise(promessa)
import { User } from "../../entities/User";

// exportando interface a ser implementada
export interface IFindUserByEmailRepositories {
  // pode achar o usuário ou retornar null se o e-mail não for encontrado
  findUserByEmail(email: string): Promise<User | null>;
}
