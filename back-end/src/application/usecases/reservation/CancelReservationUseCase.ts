// Importando interfaces a serem implementadas e serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindReservationByIdRepositories } from "../../../domain/repositories/reservation/IFindReservationByIdRepositories";
import { IPaymentProvider } from "../../../shared/providers/payment/IPaymentProvider";
import { IDayJsProvider } from "../../../shared/providers/dayjs/IDayJsProvider";
import { IUpdateReservationRepositories } from "../../../domain/repositories/reservation/IUpdateReservationRepositories";

// Importando interface de dados
import { ICancelReservationDTO } from "../../dtos/reservation/ICancelReservationDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { ReservationNotFoundError } from "../../../shared/errors/reservation-error/ReservationNotFoundError";
import { ReservationAccessDeniedError } from "../../../shared/errors/reservation-error/ReservationAccessDeniedError";
import { ReservationCancelledError } from "../../../shared/errors/reservation-error/ReservationCancelledError";
import { ReservationTransactionError } from "../../../shared/errors/reservation-error/ReservationTransactionError";
import { ReservationRefundError } from "../../../shared/errors/reservation-error/ReservationRefundError";

// Importando reservationQueue
import { reservationQueue } from "../../../shared/providers/jobs/queues/reservationQueue";

// Importando entidade Reservation para atualização do metodo estatico
import { Reservation } from "../../../domain/entities/Reservation";

// Tipos de status de pagamento
import { statusPayment } from "../../../domain/entities/Reservation";
import { statusPayment as StatusType } from "../../../domain/entities/Reservation";

// exportando usecase
export class CancelReservationUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findReservationByIdRepository: IFindReservationByIdRepositories,
    private readonly dayJsProvider: IDayJsProvider,
    private readonly paymentProvider: IPaymentProvider,
    private readonly updateReservationRepository: IUpdateReservationRepositories
  ) {}

  async execute(
    data: ICancelReservationDTO
  ): Promise<{ message: string; status: string }> {
    // verificando se o usuário existe na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // se não existir, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando se a reserva realmente existe
    const reservation =
      await this.findReservationByIdRepository.findReservationById(
        data.reservationId
      );

    // se não existir, retorna um erro
    if (!reservation) {
      throw new ReservationNotFoundError();
    }

    // caso o usuário não seja o user da reserva, retorna um erro
    if (reservation.userId !== user.id) {
      throw new ReservationAccessDeniedError();
    }

    // verificando se a reserva já foi cancelada
    if (reservation.statusPayment === statusPayment.CANCELLED) {
      throw new ReservationCancelledError();
    }

    let message = "Reserva cancelada com sucesso!";
    let newStatus: StatusType = statusPayment.CANCELLED;
    let refundProcessed = false;

    // criando try/catch para capturar erros na execução
    try {
      // armazenando o job em uma variavel
      const job = await reservationQueue.getJob(data.reservationId);

      // caso encontre o job, entra no if
      if (job) {
        await job.remove();
      }
    } catch (err: any) {
      console.error(err.message);
    }

    // reembolso nas 24 horas
    if (reservation.statusPayment === statusPayment.CONFIRMED) {
      // verificando datas
      const reservationStartTime = await this.dayJsProvider.parse(
        reservation.startTime
      );
      const hoursUntilReservation = await this.dayJsProvider.diffInHours(
        reservationStartTime,
        await this.dayJsProvider.now()
      );

      // caso a diferença seja maior que 24, entra no if
      if (hoursUntilReservation >= 24) {
        // procurando id da transação
        if (!reservation.paymentTransactionId) {
          throw new ReservationTransactionError();
        }

        // criando try/catch para capturar e erros na execução
        try {
          await this.paymentProvider.createRefund(
            reservation.paymentTransactionId as string
          );

          newStatus = statusPayment.REFUNDED;
          refundProcessed = true;
          message =
            "Reserva cancelada e reembolso processado. Aguarde a confirmação do estorno!";
        } catch (err: any) {
          newStatus = statusPayment.CANCELLED;
          throw new ReservationRefundError();
        }
      } else {
        message = "Reserva cancelada. Sem direito de reembolso!";
        newStatus = statusPayment.CANCELLED;
      }
    }

    // chamando metodo estatico para atualização
    const updatesReservation = Reservation.updatesReservation(reservation, {
      statusPayment: newStatus,
    });

    // mandando atualização para o banco de dados
    await this.updateReservationRepository.updateReservation(
      updatesReservation
    );

    // retornando dados esperados
    return { message, status: newStatus };
  }
}
