// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de error personalizado
export class UserOrderError extends ErrorSuper {
  constructor() {
    super("Não é possível realizar mais uma solicitação!", 400);
  }
}

// exportando classe de error personalizado
export class UserOrderCnpjError extends ErrorSuper {
  constructor() {
    super("Não possível criar uma solicitação, com um CNPJ já utilizado!", 400);
  }
}

// exportando classe de error personalizado
export class UsersOrdersNotFoundError extends ErrorSuper {
  constructor() {
    super("Nenhuma solicitação encontrada no momento!", 404);
  }
}

// exportando classe de error personalizado
export class UserOrderNotFoundError extends ErrorSuper {
  constructor() {
    super("Não foi possível encontrar a solicitação", 404);
  }
}

// exportando classe de error personalizado
export class UserUpdatedLimitedOrderError extends ErrorSuper {
  constructor() {
    super(
      "Aguarde alguns minutos para efetuar atualizar a solicitação novamente!",
      400
    );
  }
}

// exportando classe de error personalizado
export class OrderErrorUpdated extends ErrorSuper {
  constructor() {
    super("Não é possivel editar uma solicitação já analisada!", 400);
  }
}

// exportando classe de error personalizado
export class UserOrderNotApprovedError extends ErrorSuper {
  constructor() {
    super(
      "Não é possivel editar a permissão do usuário, sem a aprovação do pedido!",
      400
    );
  }
}
