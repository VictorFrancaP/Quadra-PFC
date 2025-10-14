// Importando interfaces a serem implementadas e serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindReservationByIdRepositories } from "../../../domain/repositories/reservation/IFindReservationByIdRepositories";
import { IPaymentProvider } from "../../../shared/providers/payment/IPaymentProvider";
import { IDayJsProvider } from "../../../shared/providers/dayjs/IDayJsProvider";

// Importando interface de dados
import { ICancelReservationDTO } from "../../dtos/reservation/ICancelReservationDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { ReservationNotFoundError } from "../../../shared/errors/reservation-error/ReservationNotFoundError";
import { ReservationAccessDeniedError } from "../../../shared/errors/reservation-error/ReservationAccessDeniedError";

// exportando usecase
export class CancelReservationUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findReservationByIdRepository: IFindReservationByIdRepositories,
    private readonly paymentProvider: IPaymentProvider,
    private readonly dayJsProvider: IDayJsProvider
  ) {}

  // async execute(data: ICancelReservationDTO): Promise<string> {
  //   // verificando se o usuário existe na base de dados
  //   const user = await this.findUserByIdRepository.findUserById(data.userId);

  //   // se não existir, retorna um erro
  //   if (!user) {
  //     throw new UserNotFoundError();
  //   }

  //   // verificando se a reserva realmente existe
  //   const reservation =
  //     await this.findReservationByIdRepository.findReservationById(
  //       data.reservationId
  //     );

  //   // se não existir, retorna um erro
  //   if (!reservation) {
  //     throw new ReservationNotFoundError();
  //   }

  //   // caso o usuário não seja o user da reserva, retorna um erro
  //   if (reservation.userId !== user.id) {
  //     throw new ReservationAccessDeniedError();
  //   }

  //   // verificando tempo para validar cancelamento
  //   const timeDifferenceHours = await this.dayJsProvider.verify(reservation.startTime);
  // }
}
