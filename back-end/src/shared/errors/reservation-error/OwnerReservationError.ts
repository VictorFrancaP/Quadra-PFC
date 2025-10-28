// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe error personalizado
export class OwnerReservationError extends ErrorSuper {
  constructor() {
    super("O proprietário não pode reservar sua propria quadra!", 400);
  }
}

// exportando classe de error personalizado
export class OwnerReservationOtherError extends ErrorSuper {
  constructor() {
    super("O proprietário não pode reservar uma quadra!", 400);
  }
}
