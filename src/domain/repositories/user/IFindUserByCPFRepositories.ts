// tipos de permissões para o usuário
import { userPermissions } from "../../entities/User";

// criando interface para ser a Promise(promessa)
export interface IDatasUserVisible {
  name: string;
  email: string;
  age: number;
  role: userPermissions;
  id: string;
}
// Exportando interface a ser implementada
export interface IFindUserByCPFRepositories {
  findUserByCPF(cpf: string): Promise<IDatasUserVisible | null>;
}
