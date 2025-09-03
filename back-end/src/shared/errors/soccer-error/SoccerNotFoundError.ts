// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class SoccerNotFoundError extends ErrorSuper {
  constructor() {
    super("Não foi possivel encontrar os dados da quadra", 404);
  }
}
