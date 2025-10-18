// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class ReservationAlreadyExists extends ErrorSuper {
  constructor() {
    super("Reserva já alocada!", 409);
  }
}
