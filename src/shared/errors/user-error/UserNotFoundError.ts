// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class UserNotFoundError extends ErrorSuper {
  constructor() {
    super("Não foi possivel encontrar os dados do usuário!", 400);
  }
}
