// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class ParticipantsIdsSameChatError extends ErrorSuper {
  constructor() {
    super("O chat deve conter dois participantes!", 400);
  }
}
