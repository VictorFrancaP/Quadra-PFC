import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindSoccerAverageUseCase } from "../../../../src/application/usecases/rating/list/FindSoccerAverageUseCase";
import { IFindSoccerAverageResponse } from "../../../../src/application/usecases/rating/list/FindSoccerAverageUseCase";
import { IFindSoccerRatingDTO } from "../../../../src/application/dtos/rating/list/IFindSoccerRatingDTO";

const mockUserId = "user-logado-id";
const mockSoccerId = "quadra-id-999";
type MockRatingItem = { rating: number; id: string };
const mockRatingsList: MockRatingItem[] = [
  { id: "r1", rating: 5 },
  { id: "r2", rating: 4 },
  { id: "r3", rating: 3 },
  { id: "r4", rating: 3 },
];
const mockRequestData: IFindSoccerRatingDTO = {
  userId: mockUserId,
  soccerId: mockSoccerId,
};
const mockFindSoccerRatingsRepository = { findSoccerRatings: vi.fn() };
const mockFindSoccerRatingRepository = { findSoccerRating: vi.fn() };
let findSoccerAverageUseCase: FindSoccerAverageUseCase;

describe("FindSoccerAverageUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindSoccerRatingsRepository.findSoccerRatings.mockResolvedValue(
      mockRatingsList as any
    );
    mockFindSoccerRatingRepository.findSoccerRating.mockResolvedValue(null);

    findSoccerAverageUseCase = new FindSoccerAverageUseCase(
      mockFindSoccerRatingsRepository as any,
      mockFindSoccerRatingRepository as any
    );
  });

  it("deve calcular a média correta e indicar que o usuário NÃO avaliou", async () => {
    const result: IFindSoccerAverageResponse =
      await findSoccerAverageUseCase.execute(mockRequestData);

    expect(
      mockFindSoccerRatingsRepository.findSoccerRatings
    ).toHaveBeenCalledWith(mockSoccerId);
    expect(
      mockFindSoccerRatingRepository.findSoccerRating
    ).toHaveBeenCalledWith(mockUserId, mockSoccerId);
    expect(result.average).toBe(3.75);

    expect(result.hasRated).toBe(false);
  });

  it("deve indicar que o usuário JÁ avaliou a quadra", async () => {
    mockFindSoccerRatingRepository.findSoccerRating.mockResolvedValue({
      id: "existing-rating",
    });

    const result: IFindSoccerAverageResponse =
      await findSoccerAverageUseCase.execute(mockRequestData);
    expect(result.hasRated).toBe(true);
    expect(result.average).toBe(3.75);
  });

  it("deve retornar média 0 e hasRated false se não houver nenhuma avaliação no DB", async () => {
    mockFindSoccerRatingsRepository.findSoccerRatings.mockResolvedValue(null);

    const result: IFindSoccerAverageResponse =
      await findSoccerAverageUseCase.execute(mockRequestData);
    expect(result.average).toBe(0);

    expect(result.hasRated).toBe(false);

    expect(
      mockFindSoccerRatingRepository.findSoccerRating
    ).toHaveBeenCalledTimes(1);
  });

  it("deve retornar média 0 se o repositório retornar um array vazio", async () => {
    mockFindSoccerRatingsRepository.findSoccerRatings.mockResolvedValue([]);

    const result: IFindSoccerAverageResponse =
      await findSoccerAverageUseCase.execute(mockRequestData);

    expect(result.average).toBe(0);
  });
});
