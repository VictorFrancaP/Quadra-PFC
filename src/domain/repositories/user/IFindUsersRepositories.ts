// Importando entidade User para promise(promessa)
import { userPermissions } from "../../entities/User";

// exportando interface de dados visiveis
export interface IUsersRequest {
  id: string;
  name: string;
  email: string;
  role: userPermissions;
  accountBlock: boolean;
}

// exportando interface a ser implementada
export interface IFindUsersRepositories {
  findUsersMany(): Promise<IUsersRequest[] | null>;
}
