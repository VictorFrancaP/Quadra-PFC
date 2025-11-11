import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindRatingsSoccerUseCase } from "../../../../src/application/usecases/rating/list/FindRatingsSoccerUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../../src/shared/errors/soccer-error/SoccerNotFoundError";
import { User } from "../../../../src/domain/entities/User";
import { Rating } from "../../../../src/domain/entities/Rating";
import { Soccer } from "../../../../src/domain/entities/Soccer";

const mockUserId = "user-logado-id";
const mockSoccerId = "soccer-to-view-ratings-id";
const mockUser = {
  id: mockUserId,
  role: "USER",
  name: "Mock User Name",
  email: "mock@user.com",
  password: "hashed_password",
  age: 30,
  address: "Rua Teste",
  cep: "00000000",
  cpf: "11122233344",
  gender: "NOTINFORM",
  profileImage: "default.png",
  latitude: -23.5,
  longitude: -46.6,
  loginAttempts: 0,
  lockAccount: null,
  accountBlock: false,
  isTwoFactorEnabled: false,
  resetToken: null,
  resetTokenExpired: null,
  twoFactorSecret: null,
  ownerPixKey: null,
};

const mockSoccer = { id: mockSoccerId, name: "Quadra Teste" };

const mockRatingsList: Rating[] = [
  { id: "r1", soccerId: mockSoccerId, rating: 5, userId: "u1" },
  { id: "r2", soccerId: mockSoccerId, rating: 4, userId: "u2" },
] as Rating[];

const mockFindUserByIdRepository = { findUserById: vi.fn() };
const mockFindSoccerByIdRepository = { findSoccerById: vi.fn() };
const mockFindRatingsSoccerRepository = { findRatings: vi.fn() };

let findRatingsSoccerUseCase: FindRatingsSoccerUseCase;

describe("FindRatingsSoccerUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue(mockUser as User);
    mockFindSoccerByIdRepository.findSoccerById.mockResolvedValue(
      mockSoccer as Soccer
    );
    mockFindRatingsSoccerRepository.findRatings.mockResolvedValue(
      mockRatingsList
    );

    findRatingsSoccerUseCase = new FindRatingsSoccerUseCase(
      mockFindUserByIdRepository,
      mockFindSoccerByIdRepository,
      mockFindRatingsSoccerRepository
    );
  });

  it("deve buscar e retornar a lista de avaliações da quadra", async () => {
    const mockRequest = { userId: mockUserId, soccerId: mockSoccerId };

    const result = await findRatingsSoccerUseCase.execute(mockRequest);

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(
      mockUserId
    );

    expect(mockFindSoccerByIdRepository.findSoccerById).toHaveBeenCalledWith(
      mockSoccerId
    );

    expect(mockFindRatingsSoccerRepository.findRatings).toHaveBeenCalledWith(
      mockSoccerId
    );

    expect(result).toEqual(mockRatingsList);
    expect(result.length).toBe(2);
  });

  it("deve lançar UserNotFoundError se o usuário solicitante não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    const mockRequest = { userId: "invalid-user", soccerId: mockSoccerId };

    await expect(findRatingsSoccerUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );
    expect(mockFindSoccerByIdRepository.findSoccerById).not.toHaveBeenCalled();
  });

  it("deve lançar SoccerNotFoundError se a quadra não for encontrada", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(mockUser as User);
    mockFindSoccerByIdRepository.findSoccerById.mockResolvedValue(null);
    const mockRequest = { userId: mockUserId, soccerId: "invalid-soccer" };

    await expect(findRatingsSoccerUseCase.execute(mockRequest)).rejects.toThrow(
      SoccerNotFoundError
    );
    expect(mockFindRatingsSoccerRepository.findRatings).not.toHaveBeenCalled();
  });

  it("deve retornar um array vazio se nenhuma avaliação for encontrada", async () => {
    mockFindRatingsSoccerRepository.findRatings.mockResolvedValue([]);
    const mockRequest = { userId: mockUserId, soccerId: mockSoccerId };

    const result = await findRatingsSoccerUseCase.execute(mockRequest);

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});
