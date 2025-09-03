// Importando tipos de permissões do usuário
import { userPermissions } from "../../../../domain/entities/User";

// exportando interface de dados
export interface IUpdateUserRoleDTO {
  userId: string;
  id: string;
  newRole: userPermissions;
}
