// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de error personalizada
export class UserAccessDeniedError extends ErrorSuper {
  constructor() {
    super(
      "Você não tem permissão para visualizar o perfil de outro usuário!",
      401
    );
  }
}

// exportando classe de error personalizada
export class UsersAccessDeniedError extends ErrorSuper {
  constructor() {
    super("Você não tem permissão para visualizar os usuários do sistema", 401);
  }
}

// exportando classe de error personalizada
export class UserDeletedAccessDeniedError extends ErrorSuper {
  constructor() {
    super("Você não tem permissão para deletar um outro usuário!", 401);
  }
}
