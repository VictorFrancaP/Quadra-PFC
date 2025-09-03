// Import ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de erro personalizada
export class UnknownError extends ErrorSuper {
  constructor() {
    super("Erro inesperado. Tente novamente mais tarde", 500);
  }
}
