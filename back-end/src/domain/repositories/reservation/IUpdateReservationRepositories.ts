// Importando entidade a ser um parameter
import { Reservation } from "../../entities/Reservation";

// exportando interface a ser implementada
export interface IUpdateReservationRepositories {
  updateReservation(reservation: Reservation): Promise<void>;
}
