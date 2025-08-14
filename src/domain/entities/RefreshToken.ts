// Importando tipos de permissões do usuário
import { userPermissions } from "./User";

// exportando classe de entidade
export class RefreshToken {
  // atributos
  public id?: string;
  public expired: Date;
  public userRole: userPermissions;
  public userId: string;

  // criando construtor (inicializador)
  constructor(
    expired: Date,
    userRole: userPermissions,
    userId: string,
    id?: string
  ) {
    this.expired = expired;
    this.userRole = userRole;
    this.userId = userId;

    if (id) this.id = id;
  }
}
