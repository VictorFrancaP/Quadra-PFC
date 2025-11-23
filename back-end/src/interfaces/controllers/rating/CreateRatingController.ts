// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerByIdRepository } from "../../../infrastruture/repository/soccer/FindSoccerByIdRepository";
import { FindSoccerRatingRepository } from "../../../infrastruture/repository/rating/FindSoccerRatingRepository";
import { FindUserRatingRepository } from "../../../infrastruture/repository/rating/FindUserRatingRepository";
import { FindReservationConfirmedRepository } from "../../../infrastruture/repository/reservation/FindReservationConfirmedRepository";
import { DayJsProvider } from "../../../shared/providers/dayjs/DayJsProvider";
import { CreateRatingRepository } from "../../../infrastruture/repository/rating/CreateRatingRepository";

// Importando usecase
import { CreateRatingUseCase } from "../../../application/usecases/rating/create/CreateRatingUseCase";

// Importando error personalizado
import { RatingFoundError } from "../../../shared/errors/rating-error/RatingFoundError";
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";
import { OwnerRatingError } from "../../../shared/errors/rating-error/OwnerRatingError";
import { UserRatingError } from "../../../shared/errors/rating-error/UserRatingError";
import { UserRatingSameError } from "../../../shared/errors/rating-error/UserRatingError";
import { ReservationNotFoundError } from "../../../shared/errors/reservation-error/ReservationNotFoundError";

// exportando controller
export class CreateRatingController {
  async handle(request: Request, response: Response) {
    // atributos
    const userId = request.user.id;
    const { rating, comments } = request.body;
    const { soccerId, ratedUserId } = request.params;

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerByIdRepository = new FindSoccerByIdRepository();
    const findSoccerRatingRepository = new FindSoccerRatingRepository();
    const findUserRatingRepository = new FindUserRatingRepository();
    const findReservationConfirmedRepository =
      new FindReservationConfirmedRepository();
    const dayJsProvider = new DayJsProvider();
    const createRatingRepository = new CreateRatingRepository();

    // instância usecase
    const useCase = new CreateRatingUseCase(
      findUserByIdRepository,
      findSoccerByIdRepository,
      findSoccerRatingRepository,
      findUserRatingRepository,
      findReservationConfirmedRepository,
      dayJsProvider,
      createRatingRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const ratings = await useCase.execute({
        rating,
        userId,
        comments,
        soccerId,
        ratedUserId,
      });

      return response.status(200).json(ratings);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de avaliação já efetuada
      if (err instanceof RatingFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de usuário não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de quadra não encontrada na base de dados
      if (err instanceof SoccerNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de rating nulo (vazio) sem valor - quadra
      if (err instanceof OwnerRatingError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de rating nulo (vazio) sem valor - usuário
      if (err instanceof UserRatingError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de reserva não encontrada
      if (err instanceof ReservationNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de usuário se autoavaliar
      if (err instanceof UserRatingSameError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
