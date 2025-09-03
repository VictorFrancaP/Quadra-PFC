// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class SoccersNotFoundError extends ErrorSuper {
  constructor() {
    super(
      "Não foi possível encontrar nenhuma quadra no momento. Tente novamente mais tarde!",
      404
    );
  }
}
