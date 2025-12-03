// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizado
export class ReservationRecentError extends ErrorSuper {
  public days: number;
  constructor(days: number) {
    super(
      `Você só poderá deletar a conta após 5 dias da sua última reserva concluída. Restam ${days} dias!`,
      400
    );
    this.days = days;
  }
}
