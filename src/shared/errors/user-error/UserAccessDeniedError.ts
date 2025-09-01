// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

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

// exportando classe de error personalizada
export class UserAccessDeniedUpdateError extends ErrorSuper {
  constructor() {
    super(
      "Você não tem permissão para editar o status de uma solicitação",
      401
    );
  }
}

// exportando classe de error personalizada
export class UserAccessDeniedRoleUpdateError extends ErrorSuper {
  constructor() {
    super(
      "Você não tem permissão para editar o tipo de permissão do usuário!",
      401
    );
  }
}

// exportando classe de error personalizada
export class UserAccessDeniedRoleSameError extends ErrorSuper {
  constructor() {
    super(
      "Não possivel editar a permissão de um usuário PROPRIÉTARIO ou ADMIN",
      400
    );
  }
}

// exportando classe de error personalizada
export class UserAccessDeniedSoccerError extends ErrorSuper {
  constructor() {
    super("Você não tem permissão para a criação de quadras no sistema!", 401);
  }
}
