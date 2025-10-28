// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class SoccerAccessDeniedError extends ErrorSuper {
  constructor() {
    super("Você não tem permissão para excluir a quadra de outro usuário", 401);
  }
}

// exportando classe de error personalizado
export class SoccerAccessDeniedUpdateError extends ErrorSuper {
  constructor() {
    super("Você não tem permissão para editar quadras", 401);
  }
}

// exportando classe de error personalizado
export class SoccerAccessDeniedOwnerError extends ErrorSuper {
  constructor() {
    super("Você não tem permissão para deletar uma quadra", 401);
  }
}

// exportando classe de error personalizada
export class SoccerAccessDeniedDeleteError extends ErrorSuper {
  constructor() {
    super("Não é possivel excluir uma quadra ativa", 400);
  }
}

// exportando classe de error personalizada
export class SoccerAccessDeniedViewError extends ErrorSuper {
  constructor() {
    super("Você não permissão para visualizar está página!", 401);
  }
}
