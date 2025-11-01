// Importando interfaces a serem instânciadas na controller
import { IFindReservationByIdRepositories } from "../../../domain/repositories/reservation/IFindReservationByIdRepositories";
import { IUpdateReservationRepositories } from "../../../domain/repositories/reservation/IUpdateReservationRepositories";
import { IDayJsProvider } from "../../../shared/providers/dayjs/IDayJsProvider";
import { IPaymentProvider } from "../../../shared/providers/payment/IPaymentProvider";

// Importando queue para gerenciamento de filas
import { reservationQueue } from "../../../shared/providers/jobs/queues/reservationQueue";
import { payoutQueue } from "../../../shared/providers/jobs/queues/payoutQueue";

// Importando tipos de status de pagamento
import { statusPayment } from "../../../domain/entities/Reservation";

// Importando entidade Reservation para utilização do metodo estatico
import { Reservation } from "../../../domain/entities/Reservation";

// Importando interface de dados
import { IHandlePaymentNotificationDTO } from "../../dtos/payment/IHandlePaymentNotificationDTO";

// exportando usecase
export class HandlePaymentNotificationUseCase {
  constructor(
    private readonly findReservationRepository: IFindReservationByIdRepositories,
    private readonly updateReservationRepository: IUpdateReservationRepositories,
    private readonly dayJsProvider: IDayJsProvider,
    private readonly paymentProvider: IPaymentProvider
  ) {}

  async execute(data: IHandlePaymentNotificationDTO): Promise<void> {
    // pegando detalhes da transação
    const transactionDetails =
      await this.paymentProvider.fetchTransactionDetails(data.mpNotificationId);

    // pegando id da reserva
    const reservationId = transactionDetails.external_reference;

    // status da transação
    const status = transactionDetails.status;

    // caso não venha nenhum id de reserva
    if (!reservationId) return;

    // procurando reserva no banco de dados
    const reservation =
      await this.findReservationRepository.findReservationById(reservationId);

    // caso não exista a reserva, retorna
    if (!reservation) return;

    // caso o status não esteja em PENDING_PAYMENT, retorna
    if (reservation.statusPayment !== statusPayment.PENDING_PAYMENT) return;

    // se o status do mercadopago webhook for aprovado
    if (status === "approved") {
      // retirando job da fila para expiração da reserva
      const job = await reservationQueue.getJob(`check-${reservationId}`);

      // caso exista o job, entra no if
      if (job) {
        await job.remove();
      }

      // pegando data de inicio da reserva
      const startTime = await this.dayJsProvider.parse(reservation.startTime);

      // calcula quando o reembolso não é possivel
      const payoutRefundNotPossible = startTime.subtract(24, "hour");

      // pegando data atual
      const now = await this.dayJsProvider.now();

      // calculando delay para executar o payout de acordo com a data atual
      const delayMilliseconds =
        payoutRefundNotPossible.valueOf() - now.valueOf();

      // caso o delay seja maior que zero, agenda o job
      if (delayMilliseconds > 0) {
        // criando job
        await payoutQueue.add(
          "payout-send",
          {
            reservationId: reservation.id,
          },
          {
            delay: delayMilliseconds,
            jobId: `payout-${reservation.id}`,
          }
        );
      } else {
        await payoutQueue.add(
          "payout-send",
          {
            reservationId: reservation.id,
          },
          {
            jobId: `payout-${reservation.id}`,
          }
        );
      }

      // atualizando com metodo estatico
      const updatesReservation = Reservation.updatesReservation(reservation, {
        statusPayment: statusPayment.CONFIRMED,
        paymentTransactionId: data.mpNotificationId,
        paymentReceivedAt: new Date(),
      });

      // mandando atualização do banco de dados
      await this.updateReservationRepository.updateReservation(
        updatesReservation
      );
    } else if (status === "rejected") {
      // atualizando com metodo estatico
      const updatesReservation = Reservation.updatesReservation(reservation, {
        statusPayment: statusPayment.CANCELLED,
      });

      // mandando atualização para banco de dados
      await this.updateReservationRepository.updateReservation(
        updatesReservation
      );

      // criando try/catch para capturar erros na execução
      try {
        // pegando job da fila
        const job = await reservationQueue.getJob(`check-${reservationId}`);

        if (job) {
          await job.remove();
        }
      } catch (err: any) {
        console.error(err.message);
      }
    }
  }
}
