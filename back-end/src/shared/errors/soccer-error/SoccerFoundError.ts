// Importando Error Super para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando error personalizado
export class SoccerFoundError extends ErrorSuper {
  constructor() {
    super("Esta quadra já foi cadastrada!", 400);
  }
}
