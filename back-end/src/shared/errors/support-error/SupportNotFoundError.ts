// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class SupportNotFoundError extends ErrorSuper {
  constructor() {
    super("Chamado não encontrado!", 404);
  }
}
