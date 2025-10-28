// Importando entidade Reservation para ser uma promise(promessa)
import { Reservation } from "../../entities/Reservation";

// exportando interface a ser implementada nesta classe
export interface IFindReservationSoccerRepositories {
  findSoccerReservation(soccerId: string): Promise<Reservation[] | null>;
}
