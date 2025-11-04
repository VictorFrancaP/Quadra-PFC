// Importando interfaces a serem implementadas e instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccerOwnerRepositories } from "../../../domain/repositories/soccer/IFindSoccerOwnerRepositories";
import { IFindReservationSoccerRepositories } from "../../../domain/repositories/reservation/IFindReservationSoccerRepositories";
import { IDayJsProvider } from "../../../shared/providers/dayjs/IDayJsProvider";

// Importando interface de dados
import { IReportReservationDTO } from "../../dtos/reservation/IReportReservationDTO";

// Importando interface de resposta
import { IReportReservationResponseDTO } from "../../dtos/reservation/IReportReservationResponseDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedRoleSameError } from "../../../shared/errors/user-error/UserAccessDeniedError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";
import { ReservationsNotFoundError } from "../../../shared/errors/reservation-error/ReservationNotFoundError";

// taxa da plataforma
const RATE_PERCENTAGE = 0.05;

// exportando usecase
export class ReportReservationUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerOwnerRepository: IFindSoccerOwnerRepositories,
    private readonly findReservationSoccerRepository: IFindReservationSoccerRepositories,
    private readonly dayJsProvider: IDayJsProvider
  ) {}

  async execute(
    data: IReportReservationDTO
  ): Promise<IReportReservationResponseDTO> {
    // procurando usuário na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando permissão do usuário
    if (user.role !== "OWNER") {
      throw new UserAccessDeniedRoleSameError();
    }

    // procurando quadra do proprietario
    const soccer = await this.findSoccerOwnerRepository.findSoccerOwner(
      user.id as string
    );

    // caso não exista, retorna um erro
    if (!soccer) {
      throw new SoccerNotFoundError();
    }

    // procurando todas as reservas na quadra
    const allReservations =
      await this.findReservationSoccerRepository.findSoccerReservation(
        soccer.id as string
      );

    // caso não encontra nada, retorna um erro
    if (!allReservations || allReservations.length === 0) {
      throw new ReservationsNotFoundError();
    }

    // listando apenas as reservas confirmadas pagas
    const confirmedReservations = allReservations.filter(
      (c) => c.statusPayment === "CONFIRMED"
    );

    // caso não tenha nenhuma confirmada, retorna zero os status
    if (confirmedReservations.length === 0) {
      const zeroStats = {
        revenueTotal: 0,
        revenueMonthlyNow: 0,
        totalReservationConfirmed: 0,
        valueReservationAverage: 0,
      };

      const zeroFinancial = {
        revenueBruta: 0,
        ratePlataform: 0,
        revenueLiquid: 0,
      };

      // retornando dados
      return {
        generalStats: zeroStats,
        financialSummary: zeroFinancial,
        detailedReservations: [],
      };
    }

    // pegando valor total de todas as reservas
    const revenueTotal = confirmedReservations.reduce(
      (sum, res) => sum + res.totalPrice,
      0
    );

    // total de reservas pagas
    const totalReservationConfirmed = confirmedReservations.length;

    // valor médio
    const valueReservationAverage = revenueTotal / totalReservationConfirmed;

    // pegando inicio e fim do mes atual
    const startMonth = await this.dayJsProvider.startOf("month");
    const endMonth = await this.dayJsProvider.endOf("month");

    // pegando as reservas efetuadas no mês
    const monthReservation = confirmedReservations.filter((r) =>
      this.dayJsProvider.isBetween(r.startTime, startMonth, endMonth)
    );

    // calculando receita mensal
    const revenueMonthlyNow = monthReservation.reduce(
      (sum, res) => sum + res.totalPrice,
      0
    );

    // calculando taxa da plataforma
    const ratePlataform = revenueMonthlyNow * RATE_PERCENTAGE;

    // calculando receita liquida
    const revenueLiquid = revenueTotal - ratePlataform;

    // retornando dados esperados
    return {
      generalStats: {
        revenueTotal,
        revenueMonthlyNow,
        totalReservationConfirmed,
        valueReservationAverage,
      },
      financialSummary: {
        revenueBruta: revenueTotal,
        ratePlataform,
        revenueLiquid,
      },
      detailedReservations: confirmedReservations,
    };
  }
}
