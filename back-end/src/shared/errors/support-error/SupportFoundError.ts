// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class SupportFoundError extends ErrorSuper {
  constructor() {
    super(
      "O seu problema está sendo resolvido. Tente novamente mais tarde!",
      400
    );
  }
}
