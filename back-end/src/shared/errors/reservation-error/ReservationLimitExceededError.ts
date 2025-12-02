// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class ReservationLimitExceededError extends ErrorSuper {
  constructor() {
    super(
      "O horário solicitado excede o horário de fechamento da quadra.",
      400
    );
  }
}
