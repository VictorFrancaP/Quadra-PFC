// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class SoccerImagesError extends ErrorSuper {
  constructor() {
    super("Nenhuma imagem encontrada para upload!", 400);
  }
}
