// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de error personalizada
export class CredentialsUserError extends ErrorSuper {
  constructor() {
    super("E-mail ou senha incorretos!", 400);
  }
}
