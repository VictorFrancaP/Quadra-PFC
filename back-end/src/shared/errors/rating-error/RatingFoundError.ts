// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class RatingFoundError extends ErrorSuper {
  constructor() {
    super("Você já realizou uma avaliação para esta quadra!", 400);
  }
}
