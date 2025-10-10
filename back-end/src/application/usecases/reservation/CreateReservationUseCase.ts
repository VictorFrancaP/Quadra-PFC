// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccerByIdRepositories } from "../../../domain/repositories/soccer/IFindSoccerByIdRepositories";
import { IFindReservationRepositories } from "../../../domain/repositories/reservation/IFindReservationRepositories";
import { ICreateReservationRepositories } from "../../../domain/repositories/reservation/ICreateReservationRepositories";

// Importando interface de dados
import { ICreateReservationDTO } from "../../dtos/reservation/ICreateReservationDTO";

// Importando entidade Reservation para ser uma promise(promessa)
import { Reservation } from "../../../domain/entities/Reservation";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";
import { SoccerNotActiveError } from "../../../shared/errors/soccer-error/SoccerNotActiveError";
import { OwnerReservationError } from "../../../shared/errors/reservation-error/OwnerReservationError";
import { ReservationDurationError } from "../../../shared/errors/reservation-error/ReservationDurationError";
import { ReservationAlreadyExists } from "../../../shared/errors/reservation-error/ReservationAlreadyExistsError";

// exportando usecase
export class CreateReservationUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerByIdRepository: IFindSoccerByIdRepositories,
    private readonly findReservationRepository: IFindReservationRepositories,
    private readonly createReservationRepository: ICreateReservationRepositories
  ) {}

  async execute(data: ICreateReservationDTO): Promise<Reservation> {
    // procurando usuário na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // procurando quadra na base de dados
    const soccer = await this.findSoccerByIdRepository.findSoccerById(
      data.soccerId
    );

    // caso não exista, retorna um erro
    if (!soccer) {
      throw new SoccerNotFoundError();
    }

    // caso a quadra não esteja ativa, retorna um erro
    if (!soccer.isActive) {
      throw new SoccerNotActiveError();
    }

    // verificando se não é o proprio proprietario, que está reservando horario
    if (soccer.userId === user.id) {
      throw new OwnerReservationError();
    }

    // verificando duração
    if (data.duration > soccer.maxDuration) {
      throw new ReservationDurationError();
    }

    // calculando horario de termino e preço total
    const endTime = new Date(data.startTime);
    endTime.setHours(endTime.getHours() + data.duration);
    const totalPrice = soccer.priceHour * data.duration;

    // procurando reserva existente
    const reservation = await this.findReservationRepository.findReservation(
      data.soccerId,
      data.startTime,
      endTime
    );

    // caso exista, retorna um erro
    if (reservation) {
        throw new ReservationAlreadyExists();
    }

    // instânciando nova entidade Reservation
    const newReservation = new Reservation(
      data.startTime,
      endTime,
      "PENDING_PAYMENT",
      totalPrice,
      data.duration,
      soccer.id as string,
      user.id as string
    );

    // mandando criação para o banco de dados
    const createReservation =
      await this.createReservationRepository.createReservation(newReservation);

    // retornando reserva criado
    return createReservation;
  }
}
