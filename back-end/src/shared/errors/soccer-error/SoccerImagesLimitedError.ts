// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class SoccerImagesLimitedError extends ErrorSuper {
  constructor() {
    super("Limite de quantidade de imagens excedido!", 400);
  }
}
