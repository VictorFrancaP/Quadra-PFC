// Importando tipos de permissões do usuário no sistema
import { userPermissions } from "../../entities/User";

// exportando interface de dados visiveis
export interface IUserData {
  id: string;
  name: string;
  email: string;
  role: userPermissions;
  accountBlock: boolean;
}

// exportando interface a ser implementada
export interface IFindUserPartialByEmailRepositories {
  findPartialDataByEmail(email: string): Promise<IUserData | null>;
}
