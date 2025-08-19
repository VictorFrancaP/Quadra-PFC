// Importando ErrorSuper para ser herdado nesta classe
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de error personalizada
export class SendMailUserNotFoundError extends ErrorSuper {
  constructor() {
    super(
      "Caso este e-mail correto, enviamos uma solicitação de redefinição de senha!",
      400
    );
  }
}
