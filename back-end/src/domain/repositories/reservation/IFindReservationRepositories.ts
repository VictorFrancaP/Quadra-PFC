// Importando entidade Reservation para ser uma promise(promessa)
import { Reservation } from "../../entities/Reservation";

// exportando interface a ser implementada
export interface IFindReservationRepositories {
  findReservation(
    soccerId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Reservation | null>;
}
