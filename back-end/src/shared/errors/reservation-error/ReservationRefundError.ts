// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class ReservationRefundError extends ErrorSuper {
  constructor() {
    super("Falha ao realizar o reembolso!", 400);
  }
}
