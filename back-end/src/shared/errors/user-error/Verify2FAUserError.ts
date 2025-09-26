// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class Verify2FAUserError extends ErrorSuper {
  constructor() {
    super("Efetue o login para ativar a autenticação de dois fatores!", 400);
  }
}

// exportando classe de error personalizada
export class IncorrectToken2FAUserError extends ErrorSuper {
  constructor() {
    super("Código inválido. Tente novamente!", 400);
  }
}
