import { describe, it, expect, vi, beforeEach } from "vitest";
import { LogoutUserUseCase } from "../../../../src/application/usecases/user/logout/LogoutUserUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { User } from "../../../../src/domain/entities/User";

const mockUserId = "user-logged-in-id";

const mockExistingUser = {
  id: mockUserId,
  email: "logout@test.com",
  name: "User Logout",
};

const mockFindUserByIdRepository = {
  findUserById: vi.fn(),
};

const mockDeleteManyRefreshTokenRepository = {
  deleteManyRefreshToken: vi.fn(),
};

let logoutUserUseCase: LogoutUserUseCase;

describe("LogoutUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockExistingUser as User
    );

    logoutUserUseCase = new LogoutUserUseCase(
      mockFindUserByIdRepository,
      mockDeleteManyRefreshTokenRepository
    );
  });

  it("deve deletar todos os refreshTokens do usuário com sucesso", async () => {
    const mockRequest = { userId: mockUserId };

    await expect(
      logoutUserUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(
      mockUserId
    );

    expect(
      mockDeleteManyRefreshTokenRepository.deleteManyRefreshToken
    ).toHaveBeenCalledTimes(1);
    expect(
      mockDeleteManyRefreshTokenRepository.deleteManyRefreshToken
    ).toHaveBeenCalledWith(mockUserId);
  });

  it("deve lançar UserNotFoundError se o usuário não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);

    const mockRequest = { userId: "non-existent-id" };

    await expect(logoutUserUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(
      "non-existent-id"
    );
    expect(
      mockDeleteManyRefreshTokenRepository.deleteManyRefreshToken
    ).not.toHaveBeenCalled();
  });
});
