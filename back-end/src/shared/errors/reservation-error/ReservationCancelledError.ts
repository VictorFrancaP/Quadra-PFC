// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de implementação de interface
export class ReservationCancelledError extends ErrorSuper {
  constructor() {
    super("A reserva já está cancelada ou expirada!", 400);
  }
}
