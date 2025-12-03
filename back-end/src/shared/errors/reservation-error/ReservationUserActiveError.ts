// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class ReservationUserActiveError extends ErrorSuper {
  constructor() {
    super(
      "Você não pode apagar a sua conta com reservas existentes ativas!",
      400
    );
  }
}
