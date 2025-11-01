// Importando interfaces a serem implementadas e instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccerOwnerRepositories } from "../../../domain/repositories/soccer/IFindSoccerOwnerRepositories";
import { IFindReservationSoccerRepositories } from "../../../domain/repositories/reservation/IFindReservationSoccerRepositories";

// Importando interface de dados
import { IFindReservationSoccerDTO } from "../../dtos/reservation/IFindReservationSoccerDTO";

// Importando entidade Reservation para ser uma promise(promessa)
import { Reservation } from "../../../domain/entities/Reservation";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedRoleSameError } from "../../../shared/errors/user-error/UserAccessDeniedError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";
import { ReservationsNotFoundError } from "../../../shared/errors/reservation-error/ReservationNotFoundError";

// exportando usecase
export class FindReservationSoccerUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerOwnerRepository: IFindSoccerOwnerRepositories,
    private readonly findReservationSoccerRepository: IFindReservationSoccerRepositories
  ) {}

  async execute(data: IFindReservationSoccerDTO): Promise<Reservation[]> {
    // verificando se usuário existe
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando permissão do usuário
    if (user.role !== "OWNER") {
      throw new UserAccessDeniedRoleSameError();
    }

    // procurando quadra do usuário (proprietário)
    const soccer = await this.findSoccerOwnerRepository.findSoccerOwner(
      user.id as string
    );

    // caso não exista, retorna um erro
    if (!soccer) {
      throw new SoccerNotFoundError();
    }

    // procurando reservas realizadas na quadra
    const reservations =
      await this.findReservationSoccerRepository.findSoccerReservation(
        soccer.id as string
      );

    // caso não exista, nenhuma reserva retorna um erro
    if (!reservations || reservations.length === 0) {
      throw new ReservationsNotFoundError();
    }

    // retornando dados
    return reservations;
  }
}
