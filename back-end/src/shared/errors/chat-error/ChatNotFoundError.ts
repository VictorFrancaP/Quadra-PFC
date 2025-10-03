// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class ChatNotFoundError extends ErrorSuper {
  constructor() {
    super("O chat não foi encontrado!", 404);
  }
}
