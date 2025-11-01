// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class ReservationNotFoundError extends ErrorSuper {
  constructor() {
    super("Reserva não encontrada!", 404);
  }
}

// exportando classe de error personalizado
export class ReservationsNotFoundError extends ErrorSuper {
  constructor() {
    super("Nenhuma reserva encontrada!", 404);
  }
}
