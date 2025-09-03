// Importando entidade User para ser uma promise(promessa)
import { User } from "../../entities/User";

// exportando interface a ser implementada
export interface ILockUserAccountRepositories {
  isLockedUserAccount(user: User): Promise<boolean>;
}
