// Importando interfaces a serem instânciadas no worker process
import { IFindReservationByIdRepositories } from "../../../domain/repositories/reservation/IFindReservationByIdRepositories";
import { IFindSoccerByIdRepositories } from "../../../domain/repositories/soccer/IFindSoccerByIdRepositories";
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IPaymentProvider } from "../../../shared/providers/payment/IPaymentProvider";
import { IUpdateReservationRepositories } from "../../../domain/repositories/reservation/IUpdateReservationRepositories";

// Importando interface de dados
import { IProcessPayoutDTO } from "../../dtos/payment/IProcessPayoutDTO";

// Importando entidade Reservation para utilização de metodo estatico
import { Reservation } from "../../../domain/entities/Reservation";

// Importando tipos de status de payout
import { statusPayout } from "../../../domain/entities/Reservation";

// taxa do sistema
const TAXA_PERCENTAGE = 0.05;

// exportando usecase
export class ProcessPayoutUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerByIdRepository: IFindSoccerByIdRepositories,
    private readonly findReservationByIdRepository: IFindReservationByIdRepositories,
    private readonly paymentProvider: IPaymentProvider,
    private readonly updateReservationRepository: IUpdateReservationRepositories
  ) {}

  async execute(data: IProcessPayoutDTO): Promise<void> {
    // procurando reserva na base de dados
    const reservation =
      await this.findReservationByIdRepository.findReservationById(
        data.reservationId
      );

    // caso não exista, retorna
    if (!reservation) return;

    // caso o status de payout seja diferente de pending, retorna
    if (reservation.statusPayout !== "PENDING") return;

    // caso o status de pagamento da reserva seja diferente de confirmado
    if (reservation.statusPayment !== "CONFIRMED") return;

    // procurando quadra na base de dados
    const soccer = await this.findSoccerByIdRepository.findSoccerById(
      reservation.soccerId
    );

    // caso não exista, retorna
    if (!soccer) return;

    // caso a quadra esteja ativa, retorna
    if (!soccer.isActive) return;

    // procurando proprietario na base de dados
    const user = await this.findUserByIdRepository.findUserById(soccer.userId);

    // caso não exista, retorna
    if (!user) return;

    // caso o usuário não seja OWNER, retorna
    if (user.role !== "OWNER") return;

    // verificando se proprietario, tem chave pix
    if (!soccer.ownerPixKey) return;

    // pegando valor total da reserva
    const totalAmount = reservation.totalPrice;

    // definindo porcentagem da taxa
    const systemFee = totalAmount * TAXA_PERCENTAGE;

    // valor a ser passado para o proprietario tirando a taxa
    const netAmount = totalAmount - systemFee;

    // criando try/catch para capturar erros na execução
    try {
      // chamando api de payout do mercagopago
      const payoutResult = await this.paymentProvider.makePayout({
        amount: netAmount,
        destination: soccer.ownerPixKey,
        description: `Payout Reserva ${reservation.id}`,
      });

      // mandando atualização para o metodo estatico do banco de dados
      const updatesReservation = Reservation.updatesReservation(reservation, {
        statusPayout: statusPayout.SUCCESS,
        netPayoutAmount: netAmount,
        systemFeeAmount: systemFee,
        payoutDate: new Date(),
        paymentTransactionId: payoutResult.transactionId,
      });

      // mandando atualização para o banco de dados
      await this.updateReservationRepository.updateReservation(
        updatesReservation
      );
    } catch (err: any) {
      // caso tenha falhado, atualizando para o status FAILED
      const updatesReservation = Reservation.updatesReservation(reservation, {
        statusPayout: statusPayout.FAILED,
      });

      // mandando atualização para o banco de dados
      await this.updateReservationRepository.updateReservation(
        updatesReservation
      );

      // erro
      throw err;
    }
  }
}
