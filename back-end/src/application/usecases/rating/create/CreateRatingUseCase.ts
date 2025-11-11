// Importando interfaces implementadas a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccerByIdRepositories } from "../../../../domain/repositories/soccer/IFindSoccerByIdRepositories";
import { IFindSoccerRatingRepositories } from "../../../../domain/repositories/rating/IFindSoccerRatingRepositories";
import { IFindUserRatingRepositories } from "../../../../domain/repositories/rating/IFindUserRatingRepositories";
import { IFindReservationConfirmedRepositories } from "../../../../domain/repositories/reservation/IFindReservationConfirmedRepositories";
import { ICreateRatingRepositories } from "../../../../domain/repositories/rating/ICreateRatingRepositories";

// Importando entidade Rating para ser uma promise(promessa)
import { Rating } from "../../../../domain/entities/Rating";

// Importando interface de dados
import { ICreateRatingDTO } from "../../../dtos/rating/create/ICreateRatingDTO";

// Importando error personalizado
import { RatingFoundError } from "../../../../shared/errors/rating-error/RatingFoundError";
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../../shared/errors/soccer-error/SoccerNotFoundError";
import { OwnerRatingError } from "../../../../shared/errors/rating-error/OwnerRatingError";
import {
  UserRatingError,
  UserRatingSameError,
} from "../../../../shared/errors/rating-error/UserRatingError";
import { ReservationNotFoundError } from "../../../../shared/errors/reservation-error/ReservationNotFoundError";

// exportando usecase
export class CreateRatingUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerByIdRepository: IFindSoccerByIdRepositories,
    private readonly findSoccerRatingRepository: IFindSoccerRatingRepositories,
    private readonly findUserRatingRepository: IFindUserRatingRepositories,
    private readonly findReservationConfirmedRepository: IFindReservationConfirmedRepositories,
    private readonly createRatingRepository: ICreateRatingRepositories
  ) {}

  async execute(data: ICreateRatingDTO): Promise<Rating> {
    // criando try/catch para capturar erros na execução
    try {
      // verificando se usuário existe
      const user = await this.findUserByIdRepository.findUserById(data.userId);

      // caso não exista, retorna um erro
      if (!user) {
        throw new UserNotFoundError();
      }

      // caso o usuário seja um usuário - USER só avaliar
      if (user.role === "USER") {
        if (!data.soccerId) {
          throw new UserRatingError();
        }

        // verificando se quadra existe
        const soccer = await this.findSoccerByIdRepository.findSoccerById(
          data.soccerId!
        );

        // caso não existe quadra, retorna um erro
        if (!soccer) {
          throw new SoccerNotFoundError();
        }

        // procurando reserva do usuário
        const reservationUser =
          await this.findReservationConfirmedRepository.findReservationConfirmed(
            user.id as string,
            soccer.id as string
          );

        if (!reservationUser) {
          throw new ReservationNotFoundError();
        }

        // verifica se não é o proprietário que está efetuando a avaliação
        if (soccer.userId === user.id) {
          throw new OwnerRatingError();
        }

        // verificando se usuário já fez uma avaliação para a quadra
        const existingRating =
          await this.findSoccerRatingRepository.findSoccerRating(
            user.id!,
            soccer.id!
          );

        // caso exista, retorna um erro
        if (existingRating) {
          throw new RatingFoundError();
        }
      }

      // verificando se usuário é proprietário
      if (user.role === "OWNER") {
        if (!data.ratedUserId) {
          throw new UserRatingSameError();
        }

        // usuário não pode avaliar a si mesmo
        if (data.ratedUserId === user.id) {
          throw new UserRatingSameError();
        }

        // verifica se o usuário avaliado existe
        const ratedUser = await this.findUserByIdRepository.findUserById(
          data.ratedUserId
        );

        // se não existir, retorna um erro
        if (!ratedUser) {
          throw new UserNotFoundError();
        }

        // verificando se proprietário já avaliou o usuário
        const existingRating =
          await this.findUserRatingRepository.findUserRating(
            data.userId,
            data.ratedUserId
          );

        // caso exista, retorna um erro
        if (existingRating) {
          throw new RatingFoundError();
        }
      }

      // criando rating em nova entidade
      const newRating = new Rating(
        data.rating,
        data.userId,
        data.comments,
        data.soccerId,
        data.ratedUserId
      );

      // mandando dados para o banco de dados
      return await this.createRatingRepository.createRating(newRating);
    } catch (err: any) {
      // caso erro seja do prisma P2002, entra no if
      if (err.code === "P2002") {
        throw new RatingFoundError();
      }
      throw new Error(err.message);
    }
  }
}
