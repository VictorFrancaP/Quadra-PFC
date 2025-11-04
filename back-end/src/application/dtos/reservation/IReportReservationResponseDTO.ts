// Importando entidade Reservation para ser um tipo na interface
import { Reservation } from "../../../domain/entities/Reservation";

// exportando interface de dados
export interface IReportReservationResponseDTO {
  generalStats: {
    revenueTotal: number;
    revenueMonthlyNow: number;
    totalReservationConfirmed: number;
    valueReservationAverage: number;
  };

  financialSummary: {
    revenueBruta: number;
    ratePlataform: number;
    revenueLiquid: number;
  };

  detailedReservations: Reservation[];
}
