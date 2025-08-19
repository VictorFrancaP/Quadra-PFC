// Importando interface a ser implementada nesta classe e dayjs para manipulação de datas
import { ILockUserAccountRepositories } from "../../../domain/repositories/user/ILockUserAccountRepositories";
import { User } from "../../../domain/entities/User";
import dayjs from "dayjs";

// exportando classe de implementação de interface
export class LockUserAccountRepository implements ILockUserAccountRepositories {
  async isLockedUserAccount(user: User): Promise<boolean> {
    // verificando se lockAccount é nulo
    if (!user.lockAccount) return false;

    // verificando se o bloqueio está ativo ainda
    const isLockedAccount = dayjs().isBefore(user.lockAccount);

    // retornando resultado do tipo boolean
    return isLockedAccount;
  }
}
