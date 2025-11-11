import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindReservationUserUseCase } from "../../../../src/application/usecases/reservation/FindReservationUserUseCase";
import { IReservationWithRatingStatus } from "../../../../src/application/usecases/reservation/FindReservationUserUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { ReservationNotFoundError } from "../../../../src/shared/errors/reservation-error/ReservationNotFoundError";
import { User } from "../../../../src/domain/entities/User";
import { Reservation } from "../../../../src/domain/entities/Reservation";

const mockUserId = "user-logged-in-id";
const mockSoccerId1 = "soccer-id-1";
const mockSoccerId2 = "soccer-id-2";
const mockUser = { id: mockUserId, name: "Test User" };

const mockReservationsList: Reservation[] = [
  { id: "res-1", userId: mockUserId, soccerId: mockSoccerId1 },
  { id: "res-2", userId: mockUserId, soccerId: mockSoccerId2 },
] as Reservation[];

const mockFindUserByIdRepository = { findUserById: vi.fn() };
const mockFindReservationUserRepository = { findUserReservation: vi.fn() };
const mockFindSoccerRatingRepository = { findSoccerRating: vi.fn() };

let findReservationUserUseCase: FindReservationUserUseCase;

describe("FindReservationUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue(mockUser as User);
    mockFindReservationUserRepository.findUserReservation.mockResolvedValue(
      mockReservationsList
    );

    mockFindSoccerRatingRepository.findSoccerRating.mockImplementation(
      (userId, soccerId) => {
        if (soccerId === mockSoccerId1) {
          return Promise.resolve({ ratingId: "rating-1" });
        }
        return Promise.resolve(null);
      }
    );

    findReservationUserUseCase = new FindReservationUserUseCase(
      mockFindUserByIdRepository,
      mockFindReservationUserRepository,
      mockFindSoccerRatingRepository
    );
  });

  it("deve retornar a lista de reservas com o status hasBeenRated corretamente anexado", async () => {
    const mockRequest = { userId: mockUserId };

    const result = await findReservationUserUseCase.execute(mockRequest);

    expect(
      mockFindReservationUserRepository.findUserReservation
    ).toHaveBeenCalledWith(mockUserId);

    expect(
      mockFindSoccerRatingRepository.findSoccerRating
    ).toHaveBeenCalledTimes(2);

    expect(result).toHaveLength(2);

    const res1 = result.find(
      (r) => r.id === "res-1"
    ) as IReservationWithRatingStatus;
    const res2 = result.find(
      (r) => r.id === "res-2"
    ) as IReservationWithRatingStatus;

    expect(res1.hasBeenRated).toBe(true);

    expect(res2.hasBeenRated).toBe(false);
  });

  it("deve lançar UserNotFoundError se o usuário logado não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    const mockRequest = { userId: "invalid-user" };

    await expect(
      findReservationUserUseCase.execute(mockRequest)
    ).rejects.toThrow(UserNotFoundError);
    expect(
      mockFindReservationUserRepository.findUserReservation
    ).not.toHaveBeenCalled();
  });

  it("deve lançar ReservationNotFoundError se o usuário não tiver nenhuma reserva", async () => {
    mockFindReservationUserRepository.findUserReservation.mockResolvedValue([]);
    const mockRequest = { userId: mockUserId };

    await expect(
      findReservationUserUseCase.execute(mockRequest)
    ).rejects.toThrow(ReservationNotFoundError);

    expect(
      mockFindSoccerRatingRepository.findSoccerRating
    ).not.toHaveBeenCalled();
  });

  it("deve lançar ReservationNotFoundError se o repositório retornar null", async () => {
    mockFindReservationUserRepository.findUserReservation.mockResolvedValue(
      null
    );
    const mockRequest = { userId: mockUserId };

    await expect(
      findReservationUserUseCase.execute(mockRequest)
    ).rejects.toThrow(ReservationNotFoundError);
  });
});
