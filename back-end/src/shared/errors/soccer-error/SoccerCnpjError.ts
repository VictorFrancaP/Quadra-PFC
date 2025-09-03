// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando error personalizado
export class SoccerCnpjError extends ErrorSuper {
  constructor() {
    super("Não é possivel, cadastrar mais de uma quadra com o mesmo CNPJ", 400);
  }
}
