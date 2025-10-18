// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class ReservationDurationError extends ErrorSuper {
  constructor() {
    super("Escolhe um duração válida para reservar a quadra!", 400);
  }
}
