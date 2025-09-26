// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class Setup2FAUserError extends ErrorSuper {
  constructor() {
    super("A autenticação de dois fatores já está ativada!", 400);
  }
}
