// Importando interfaces a serem implementadas
import { IFindReservationByIdRepositories } from "../../../domain/repositories/reservation/IFindReservationByIdRepositories";
import { IUpdateReservationRepositories } from "../../../domain/repositories/reservation/IUpdateReservationRepositories";

// Importando interface de dados
import { IFindExpiredReservationDTO } from "../../dtos/reservation/IFindExpiredReservationDTO";

// Importando entidade Reservation para utilização do metodo estatico
import { Reservation } from "../../../domain/entities/Reservation";

// exportando usecase
export class ExpiredReservationUseCase {
  constructor(
    private readonly findReservationByIdRepository: IFindReservationByIdRepositories,
    private readonly updateReservationRepository: IUpdateReservationRepositories
  ) {}

  async execute(data: IFindExpiredReservationDTO): Promise<void> {
    // verificando se a reserva realmente existe
    const reservation =
      await this.findReservationByIdRepository.findReservationById(
        data.reservationId
      );

    // caso não exista, apenas retorna
    if (!reservation) {
      return;
    }

    // verificando se o status da reserva é pending ainda, caso seja entra no if
    if (reservation.statusPayment === data.expectedStatus) {
      // atualizando status para cancelado
      const updatesReservation = Reservation.updatesReservation(reservation, {
        statusPayment: "CANCELLED",
      });

      // mandando atualização para o banco de dados
      await this.updateReservationRepository.updateReservation(
        updatesReservation
      );
    }
  }
} 
