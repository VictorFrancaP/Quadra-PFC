// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// Importando error personalizado
export class ReservationTimePassedError extends ErrorSuper {
  constructor() {
    super("Você não pode reservar em uma data anterior!", 400);
  }
}
