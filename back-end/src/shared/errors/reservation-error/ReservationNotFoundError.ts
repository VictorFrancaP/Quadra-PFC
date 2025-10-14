// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class ReservationNotFoundError extends ErrorSuper {
  constructor() {
    super("Reserva não encontrada!", 404);
  }
}
