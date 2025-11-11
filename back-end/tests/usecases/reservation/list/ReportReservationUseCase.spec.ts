import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReportReservationUseCase } from "../../../../src/application/usecases/reservation/ReportReservationUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedRoleSameError } from "../../../../src/shared/errors/user-error/UserAccessDeniedError";
import { SoccerNotFoundError } from "../../../../src/shared/errors/soccer-error/SoccerNotFoundError";
import { ReservationsNotFoundError } from "../../../../src/shared/errors/reservation-error/ReservationNotFoundError";
import { User } from "../../../../src/domain/entities/User";
import { Reservation } from "../../../../src/domain/entities/Reservation";

const mockOwnerId = "owner-id-123";
const mockUserId = "user-id-456";
const mockSoccerId = "soccer-id-789";
const mockTaxRate = 0.05;
const DATE_THIS_MONTH = new Date("2025-11-10T10:00:00Z");
const DATE_LAST_MONTH = new Date("2025-10-25T10:00:00Z");
const createMockReservation = (
  id: string,
  status: string,
  price: number,
  date: Date
): Reservation =>
  ({
    id,
    statusPayment: status,
    totalPrice: price,
    startTime: date,
    userId: "client",
    soccerId: mockSoccerId,
    duration: 1,
    endTime: date,
    expiredIn: date,
  } as Reservation);

const mockAllReservations = [
  createMockReservation("r1", "CONFIRMED", 100, DATE_THIS_MONTH),
  createMockReservation("r2", "CONFIRMED", 200, DATE_THIS_MONTH),
  createMockReservation("r3", "CONFIRMED", 300, DATE_LAST_MONTH),
  createMockReservation("r4", "PENDING", 500, DATE_THIS_MONTH),
];

const mockFindUserByIdRepository = { findUserById: vi.fn() };
const mockFindSoccerOwnerRepository = { findSoccerOwner: vi.fn() };
const mockFindReservationSoccerRepository = { findSoccerReservation: vi.fn() };
const mockDayJsProvider = {
  startOf: vi.fn(),
  endOf: vi.fn(),
  isBetween: vi.fn(),
};

let reportReservationUseCase: ReportReservationUseCase;

describe("ReportReservationUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue({
      id: mockOwnerId,
      role: "OWNER",
    } as User);
    mockFindSoccerOwnerRepository.findSoccerOwner.mockResolvedValue({
      id: mockSoccerId,
      userId: mockOwnerId,
    });
    mockFindReservationSoccerRepository.findSoccerReservation.mockResolvedValue(
      mockAllReservations
    );

    mockDayJsProvider.startOf.mockResolvedValue(new Date("2025-11-01"));
    mockDayJsProvider.endOf.mockResolvedValue(new Date("2025-11-30"));

    mockDayJsProvider.isBetween.mockImplementation((date, start, end) => {
      return date === DATE_THIS_MONTH;
    });

    reportReservationUseCase = new ReportReservationUseCase(
      mockFindUserByIdRepository,
      mockFindSoccerOwnerRepository,
      mockFindReservationSoccerRepository,
      mockDayJsProvider as any
    );
  });

  it("deve calcular corretamente as estatísticas totais, mensais e a taxa da plataforma", async () => {
    const mockRequest = { userId: mockOwnerId };

    const result = await reportReservationUseCase.execute(mockRequest);
    const expectedRevenueTotal = 600;
    expect(result.generalStats.revenueTotal).toBe(expectedRevenueTotal);
    expect(result.financialSummary.revenueBruta).toBe(expectedRevenueTotal);

    const expectedRevenueMonthly = 300;
    expect(result.generalStats.revenueMonthlyNow).toBe(expectedRevenueMonthly);

    const expectedRate = expectedRevenueMonthly * mockTaxRate;
    expect(result.financialSummary.ratePlataform).toBe(expectedRate);

    const expectedRevenueLiquid = expectedRevenueTotal - expectedRate;
    expect(result.financialSummary.revenueLiquid).toBe(expectedRevenueLiquid);

    expect(result.generalStats.totalReservationConfirmed).toBe(3);
    expect(result.generalStats.valueReservationAverage).toBe(600 / 3);
    expect(result.detailedReservations).toHaveLength(3);
  });

  it("deve lançar UserNotFoundError se o usuário não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    await expect(
      reportReservationUseCase.execute({ userId: "invalid" })
    ).rejects.toThrow(UserNotFoundError);
  });

  it("deve lançar UserAccessDeniedRoleSameError se o usuário não for OWNER", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue({
      id: mockUserId,
      role: "USER",
    });
    await expect(
      reportReservationUseCase.execute({ userId: mockUserId })
    ).rejects.toThrow(UserAccessDeniedRoleSameError);
  });

  it("deve lançar SoccerNotFoundError se o proprietário não tiver quadra cadastrada", async () => {
    mockFindSoccerOwnerRepository.findSoccerOwner.mockResolvedValue(null);
    await expect(
      reportReservationUseCase.execute({ userId: mockOwnerId })
    ).rejects.toThrow(SoccerNotFoundError);
  });

  it("deve lançar ReservationsNotFoundError se não houver nenhuma reserva na quadra", async () => {
    mockFindReservationSoccerRepository.findSoccerReservation.mockResolvedValue(
      []
    );
    await expect(
      reportReservationUseCase.execute({ userId: mockOwnerId })
    ).rejects.toThrow(ReservationsNotFoundError);
  });

  it("deve retornar zero stats se houver reservas mas nenhuma estiver CONFIRMED", async () => {
    const nonConfirmedReservations = [
      createMockReservation("r1", "PENDING", 100, DATE_THIS_MONTH),
    ];
    mockFindReservationSoccerRepository.findSoccerReservation.mockResolvedValue(
      nonConfirmedReservations
    );

    const result = await reportReservationUseCase.execute({
      userId: mockOwnerId,
    });

    expect(result.generalStats.revenueTotal).toBe(0);
    expect(result.financialSummary.revenueLiquid).toBe(0);
    expect(result.detailedReservations).toHaveLength(0);
  });
});
