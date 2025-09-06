// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class SoccerNotActiveError extends ErrorSuper {
  constructor() {
    super("Não é possivel, mandar e-mail para uma quadra desativada!", 400);
  }
}
