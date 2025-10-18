// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class ReservationAccessDeniedError extends ErrorSuper {
  constructor() {
    super("Você não tem permissão para cancelar a reserva!", 400);
  }
}
