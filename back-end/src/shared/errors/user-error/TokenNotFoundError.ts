// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class TokenNotFoundError extends ErrorSuper {
  constructor() {
    super("Token do usuário não encontrado!", 404);
  }
}
