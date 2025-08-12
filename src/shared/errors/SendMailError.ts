// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de error personalizada
export class SendMailError extends ErrorSuper {
  constructor() {
    super("Não foi possivel realizar o envio de e-mail", 400);
  }
}
