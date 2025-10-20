// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class ReservationTransactionError extends ErrorSuper {
  constructor() {
    super("ID da transação da reserva não encontrada!", 404);
  }
}
