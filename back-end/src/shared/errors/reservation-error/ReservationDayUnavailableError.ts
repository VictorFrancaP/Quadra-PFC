// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// Importando error personalizado
export class ReservationDayUnavailableError extends ErrorSuper {
  constructor() {
    super("Não é possivel reservar a quadra em um dia indisponivel!", 400);
  }
}
