// Importando interfaces a serem implementadas e instanciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindReservationUserRepositories } from "../../../domain/repositories/reservation/IFindReservationUserRepositories";
import { IFindSoccerRatingRepositories } from "../../../domain/repositories/rating/IFindSoccerRatingRepositories";

// Importando interface de dados
import { IFindReservationUserDTO } from "../../dtos/reservation/IFindReservationUserDTO";

// Importando entidade Reservation para ser uma Promise(promessa)
import { Reservation } from "../../../domain/entities/Reservation";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { ReservationNotFoundError } from "../../../shared/errors/reservation-error/ReservationNotFoundError";

// exportando interface de resposta
export interface IReservationWithRatingStatus extends Reservation {
  hasBeenRated: boolean;
}
// exportando usecase
export class FindReservationUserUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findReservationUserRepository: IFindReservationUserRepositories,
    private readonly findSoccerRatingRepository: IFindSoccerRatingRepositories
  ) {}

  async execute(
    data: IFindReservationUserDTO
  ): Promise<IReservationWithRatingStatus[]> {
    // procurando usuário na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não encontre, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // procurando reservado do usuário
    const reservations =
      await this.findReservationUserRepository.findUserReservation(
        user.id as string
      );

    // caso não encontre, retorna um erro
    if (!reservations || reservations.length === 0) {
      throw new ReservationNotFoundError();
    }

    // procurando avaliação da quadra
    const reservationsWithStatus = await Promise.all(
      reservations.map(async (reservation) => {
        const existingRating =
          await this.findSoccerRatingRepository.findSoccerRating(
            user.id!,
            reservation.soccerId!
          );

        return {
          ...reservation,
          hasBeenRated: !!existingRating,
        } as IReservationWithRatingStatus;
      })
    );

    // retornando dados
    return reservationsWithStatus;
  }
}
