// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class CredentialsUserError extends ErrorSuper {
  constructor() {
    super("E-mail ou senha incorretos!", 400);
  }
}

// exportando classe de error personalizada
export class PasswordUserSameError extends ErrorSuper {
  constructor() {
    super("Sua nova senha, não pode ser a mesma que a anterior!", 400);
  }
}
