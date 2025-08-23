// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe error personalizado
export class SolicitationAlreadyExists extends ErrorSuper {
  constructor() {
    super(
      "Você já realizou uma solicitação para ser proprietário. Aguarde o retorno da sua solicitação!",
      400
    );
  }
}

// exportando classe error personalizado
export class cnpjSolicitationOwnerAlreadyExistsError extends ErrorSuper {
  constructor() {
    super("Este CNPJ já está em uso!", 400);
  }
}
