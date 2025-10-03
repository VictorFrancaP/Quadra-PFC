// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class AccessDeniedChatError extends ErrorSuper {
  constructor() {
    super("Você não tem acesso a este chat!", 401);
  }
}
