// Importando entidade Reservation para ser uma promise(promessa)
import { Reservation } from "../../entities/Reservation";

// exportando interface de dados
export interface IFindReservationConfirmedRepositories {
  findReservationConfirmed(
    userId: string,
    soccerId: string
  ): Promise<Reservation | null>;
}
