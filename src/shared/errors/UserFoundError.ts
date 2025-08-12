// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de error personalizada
export class UserFoundError extends ErrorSuper {
  constructor() {
    super("Este e-mail já está em uso!", 400);
  }
}
