import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindUserAverageUseCase } from "../../../../src/application/usecases/rating/list/FindUserAverageUseCase";
import { IFindUserRatingDTO } from "../../../../src/application/dtos/rating/list/IFindUserRatingDTO";

const mockUserId = "user-to-evaluate-id";

type MockRatingItem = { rating: number };
const mockRatingsList: MockRatingItem[] = [
  { rating: 5 },
  { rating: 4 },
  { rating: 3 },
];
const mockRequestData: IFindUserRatingDTO = {
  userId: mockUserId,
};

const mockFindUserRatingRepository = {
  findUserRatings: vi.fn(),
};

let findUserAverageUseCase: FindUserAverageUseCase;

describe("FindUserAverageUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserRatingRepository.findUserRatings.mockResolvedValue(
      mockRatingsList as any
    );

    findUserAverageUseCase = new FindUserAverageUseCase(
      mockFindUserRatingRepository as any
    );
  });

  it("deve buscar as avaliações e calcular a média corretamente", async () => {
    const expectedAverage = 4.0;

    const result = await findUserAverageUseCase.execute(mockRequestData);

    expect(mockFindUserRatingRepository.findUserRatings).toHaveBeenCalledWith(
      mockUserId
    );

    expect(result).toBe(expectedAverage);
  });

  it("deve retornar 0 se o repositório retornar null (sem avaliações)", async () => {
    mockFindUserRatingRepository.findUserRatings.mockResolvedValue(null);

    const result = await findUserAverageUseCase.execute(mockRequestData);
    expect(result).toBe(0);
  });

  it("deve retornar 0 se o repositório retornar uma lista vazia", async () => {
    mockFindUserRatingRepository.findUserRatings.mockResolvedValue([]);

    const result = await findUserAverageUseCase.execute(mockRequestData);

    expect(result).toBe(0);
  });

  it("deve retornar 0 se a lista de avaliações tiver a soma 0, mas com registros", async () => {
    const zeroSumRatings = [{ rating: 1 }, { rating: -1 }];
    mockFindUserRatingRepository.findUserRatings.mockResolvedValue(
      zeroSumRatings as any
    );

    const result = await findUserAverageUseCase.execute(mockRequestData);

    expect(result).toBe(0);
  });
});
