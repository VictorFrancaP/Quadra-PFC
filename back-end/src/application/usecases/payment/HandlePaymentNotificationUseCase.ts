// Importando interfaces a serem instânciadas na controller
import { IFindReservationByIdRepositories } from "../../../domain/repositories/reservation/IFindReservationByIdRepositories";
import { IUpdateReservationRepositories } from "../../../domain/repositories/reservation/IUpdateReservationRepositories";
import { IPaymentProvider } from "../../../shared/providers/payment/IPaymentProvider";

// Importando queue para gerenciamento de filas
import { reservationQueue } from "../../../shared/providers/jobs/queues/reservationQueue";

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
    if (reservation.statusPayment !== statusPayment.PENDIND_PAYMENT) return;

    // se o status do mercadopago webhook for aprovado
    if (status === "approved") {
      // retirando job da fila para expiração da reserva
      const job = await reservationQueue.getJob(reservationId);

      // caso exista o job, entra no if
      if (job) {
        await job.remove();
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
        const job = await reservationQueue.getJob(reservationId);

        if (job) {
          await job.remove();
        }
      } catch (err: any) {
        console.error(err.message);
      }
    }
  }
}
