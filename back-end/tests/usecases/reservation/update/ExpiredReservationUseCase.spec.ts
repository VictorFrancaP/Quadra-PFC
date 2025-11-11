import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExpiredReservationUseCase } from "../../../../src/application/usecases/reservation/ExpiredReservationUseCase";
import { Reservation } from "../../../../src/domain/entities/Reservation";

const mockReservationId = "expired-res-id-123";
const PENDING_STATUS = "PENDING_PAYMENT";
const CONFIRMED_STATUS = "CONFIRMED";
const CANCELLED_STATUS = "CANCELLED";

const mockReservationBase = {
  id: mockReservationId,
  statusPayment: PENDING_STATUS,
  userId: "user-id",
  soccerId: "soccer-id",
  totalPrice: 100,
} as Reservation;

const mockFindReservationByIdRepositories = { findReservationById: vi.fn() };
const mockUpdateReservationRepositories = { updateReservation: vi.fn() };

let expiredReservationUseCase: ExpiredReservationUseCase;

describe("ExpiredReservationUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindReservationByIdRepositories.findReservationById.mockResolvedValue(
      mockReservationBase
    );

    expiredReservationUseCase = new ExpiredReservationUseCase(
      mockFindReservationByIdRepositories,
      mockUpdateReservationRepositories
    );
  });


  it("deve atualizar o status para CANCELLED se a reserva estiver PENDING_PAYMENT", async () => {
    const mockRequest = {
      reservationId: mockReservationId,
      expectedStatus: PENDING_STATUS,
    };

    await expect(
      expiredReservationUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(
      mockFindReservationByIdRepositories.findReservationById
    ).toHaveBeenCalledWith(mockReservationId);

    expect(
      mockUpdateReservationRepositories.updateReservation
    ).toHaveBeenCalledTimes(1);

    const updatedReservation =
      mockUpdateReservationRepositories.updateReservation.mock.calls[0]![0];
    expect(updatedReservation.statusPayment).toBe(CANCELLED_STATUS);
  });

  it("deve retornar e não fazer nada se a reserva não existir mais", async () => {
    mockFindReservationByIdRepositories.findReservationById.mockResolvedValue(
      null
    );
    const mockRequest = {
      reservationId: "non-existent-id",
      expectedStatus: PENDING_STATUS,
    };

    await expect(
      expiredReservationUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(
      mockUpdateReservationRepositories.updateReservation
    ).not.toHaveBeenCalled();
  });

  it("deve retornar e não atualizar se o status for diferente de PENDING_PAYMENT (ex: CONFIRMED)", async () => {
    const mockConfirmedReservation = {
      ...mockReservationBase,
      statusPayment: CONFIRMED_STATUS,
    };
    mockFindReservationByIdRepositories.findReservationById.mockResolvedValue(
      mockConfirmedReservation as Reservation
    );

    const mockRequest = {
      reservationId: mockReservationId,
      expectedStatus: PENDING_STATUS,
    };

    await expect(
      expiredReservationUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(
      mockUpdateReservationRepositories.updateReservation
    ).not.toHaveBeenCalled();
  });
});
