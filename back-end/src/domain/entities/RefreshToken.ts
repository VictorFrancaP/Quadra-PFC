// Importando tipos de permissões do usuário
import { userPermissions } from "./User";

// exportando classe de entidade
export class RefreshToken {
  // atributos
  public id?: string;
  public userRole: userPermissions;
  public userId: string;

  // criando construtor (inicializador)
  constructor(userRole: userPermissions, userId: string, id?: string) {
    this.userRole = userRole;
    this.userId = userId;

    if (id) this.id = id;
  }
}
