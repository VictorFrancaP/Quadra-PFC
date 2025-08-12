// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de erro personalizada
export class LimitRatingSendMailError extends ErrorSuper {
  constructor() {
    super(
      "Aguarde alguns minutos para efetuar outro envio de e-mail de confirmação!",
      400
    );
  }
}
