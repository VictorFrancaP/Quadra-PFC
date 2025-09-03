// Importando entidade User para a promise(promessa)
import { User } from "../../entities/User";

// exportando interface a ser implementada
export interface IFindUserResetTokenRepositories {
  findUserToken(resetToken: string): Promise<User | null>;
}
