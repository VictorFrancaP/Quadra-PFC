// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccerByIdRepositories } from "../../../domain/repositories/soccer/IFindSoccerByIdRepositories";
import { IFindReservationRepositories } from "../../../domain/repositories/reservation/IFindReservationRepositories";
import { IDayJsProvider } from "../../../shared/providers/dayjs/IDayJsProvider";
import { IPaymentProvider } from "../../../shared/providers/payment/IPaymentProvider";
import { IUpdateReservationRepositories } from "../../../domain/repositories/reservation/IUpdateReservationRepositories";
import { ICreateReservationRepositories } from "../../../domain/repositories/reservation/ICreateReservationRepositories";

// Importando reservationQueue para manipular o tempo de pagamento
import { reservationQueue } from "../../../shared/providers/jobs/queues/reservationQueue";

// Importando interface de dados
import { ICreateReservationDTO } from "../../dtos/reservation/ICreateReservationDTO";

// Importando entidade Reservation para ser uma promise(promessa)
import { Reservation } from "../../../domain/entities/Reservation";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";
import { SoccerNotActiveError } from "../../../shared/errors/soccer-error/SoccerNotActiveError";
import {
  OwnerReservationError,
  OwnerReservationOtherError,
} from "../../../shared/errors/reservation-error/OwnerReservationError";
import { ReservationDurationError } from "../../../shared/errors/reservation-error/ReservationDurationError";
import { ReservationAlreadyExists } from "../../../shared/errors/reservation-error/ReservationAlreadyExistsError";
import { ReservationTimePassedError } from "../../../shared/errors/reservation-error/ReservationTimePassedError";
import { ReservationDayUnavailableError } from "../../../shared/errors/reservation-error/ReservationDayUnavailableError";
import { ReservationLimitExceededError } from "../../../shared/errors/reservation-error/ReservationLimitExceededError";

// dias cadastrados para a quadra
const DAY_MAP_PT_BR = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sabado",
];

// exportando usecase
export class CreateReservationUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerByIdRepository: IFindSoccerByIdRepositories,
    private readonly findReservationRepository: IFindReservationRepositories,
    private readonly dayJsProvider: IDayJsProvider,
    private readonly paymentProvider: IPaymentProvider,
    private readonly updateReservationRepository: IUpdateReservationRepositories,
    private readonly createReservationRepository: ICreateReservationRepositories
  ) {}

  async execute(
    data: ICreateReservationDTO
  ): Promise<{ reservation: Reservation; initPoint: string }> {
    // procurando usuário na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // caso o usuário for proprietario, retorna um erro
    if (user.role === "OWNER") {
      throw new OwnerReservationOtherError();
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

    // pegando data inicio escolhida pelo usuário
    const requestedStartTime = await this.dayJsProvider.parse(data.startTime);
    const nowHour = await this.dayJsProvider.now();

    // verifica se a hora de início solicitada é anterior à hora atual
    if (requestedStartTime.isBefore(nowHour)) {
      throw new ReservationTimePassedError();
    }

    // pegando indice dos dias da semana
    const requestedDayIndex = requestedStartTime.day();

    // pegando nomes pelo indice
    const requestedDayName = DAY_MAP_PT_BR[requestedDayIndex];

    // verificando se o nome do dia extraído está na lista de operationDays da quadra
    if (!soccer.operationDays.includes(requestedDayName!)) {
      throw new ReservationDayUnavailableError();
    }

    // isso garante que se o servidor for UTC, trazemos para a hora local da quadra - Brasil 
    const brazilTimeStart = requestedStartTime.subtract(3, "hour");

    // converte a hora de início para minutos totais do dia
    const startMinutes =
      brazilTimeStart.hour() * 60 + brazilTimeStart.minute();

    // calcula os minutos de duração e o minuto final
    const durationMinutes = data.duration * 60;
    const endMinutes = startMinutes + durationMinutes;

    // converte o horário de fechamento do banco para minutos totais
    const [closingH, closingM] = soccer.closingHour.split(":").map(Number);
    const closingMinutes = closingH! * 60 + closingM!;

    // se o minuto final escolhido for maior que o minuto de fechamento, retorna um erro
    if (endMinutes > closingMinutes) {
      throw new ReservationLimitExceededError();
    }

    // calcula o horário de término padrão para salvar no banco
    const requestedEndTime = requestedStartTime.add(data.duration, "hour");

    // verificando se não é o proprio proprietario, que está reservando horario
    if (soccer.userId === user.id) {
      throw new OwnerReservationError();
    }

    // verificando duração
    if (data.duration > soccer.maxDuration) {
      throw new ReservationDurationError();
    }

    // calculando horario de termino e preço total
    const endTime = requestedEndTime.toDate();
    const totalPrice = soccer.priceHour * data.duration;

    // Se a reserva existir (o repositório faz a verificação de sobreposição), retorna erro.
    const reservation = await this.findReservationRepository.findReservation(
      data.soccerId,
      data.startTime,
      endTime
    );

    // caso exista, retorna um erro
    if (reservation) {
      throw new ReservationAlreadyExists();
    }

    // tempo de expiração para efetuar o pagamento
    const expiredIn = await this.dayJsProvider.add(5, "minute");

    // instânciando nova entidade Reservation
    const newReservation = new Reservation(
      data.startTime,
      endTime,
      "PENDING_PAYMENT",
      "PENDING",
      expiredIn,
      totalPrice,
      data.duration,
      soccer.id as string,
      user.id as string,
      soccer.name,
      user.name,
      user.email
    );

    // mandando criação para o banco de dados
    const createReservation =
      await this.createReservationRepository.createReservation(newReservation);

    // chamando provider do mercadopago e desestruturando dados
    const { preferenceId, initPoint } =
      await this.paymentProvider.createPaymentPreference(
        createReservation.totalPrice,
        `Reserva da quadra: ${soccer.id}`,
        createReservation.id as string
      );

    // data atual
    const now = Date.now();

    // expiração em milisegundos
    const expiredInMiliseconds = expiredIn.valueOf();

    // delay
    const delayDuration = expiredInMiliseconds - now;

    // adicionando a fila (SE O REDIS FALHAR, ENVOLVER ISSO NUM TRY/CATCH PODE SALVAR A DEMO)
    try {
      await reservationQueue.add(
        "check-reservation-status",
        {
          reservationId: createReservation.id as string,
          expectedStatus: "PENDING_PAYMENT",
        },
        { delay: delayDuration, jobId: `check-${createReservation.id}` }
      );
    } catch (error) {
      console.log("Erro ao adicionar na fila (Redis offline?):", error);
      // Não damos throw aqui para não travar a reserva na apresentação
    }

    // chamando metodo estatico para atualização de informação do usuário
    const updatesReservation = Reservation.updatesReservation(
      createReservation,
      {
        paymentTransactionId: preferenceId,
      }
    );

    // mandando atualização para o banco de dados
    await this.updateReservationRepository.updateReservation(
      updatesReservation
    );

    // retornando dados esperados
    return {
      reservation: createReservation,
      initPoint,
    };
  }
}