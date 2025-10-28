// Importando entidade Reservation para ser uma promise(promessa)
import { Reservation } from "../../entities/Reservation";

// exportando interface a ser implementada
export interface IFindReservationUserRepositories {
  findUserReservation(userId: string): Promise<Reservation[] | null>;
}
