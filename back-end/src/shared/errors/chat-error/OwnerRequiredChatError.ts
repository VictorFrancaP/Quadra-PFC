// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class OwnerRequiredChatError extends ErrorSuper {
  constructor() {
    super("Um dos participantes deve ser proprietário!", 400);
  }
}
