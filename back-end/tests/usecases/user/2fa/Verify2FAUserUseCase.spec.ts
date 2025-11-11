import { describe, it, expect, vi, beforeEach } from "vitest";
import { Verify2FAUserUseCase } from "../../../../src/application/usecases/user/2fa/Verify2FAUserUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { Verify2FAUserError } from "../../../../src/shared/errors/user-error/Verify2FAUserError";
import { IncorrectToken2FAUserError } from "../../../../src/shared/errors/user-error/Verify2FAUserError";
import { User } from "../../../../src/domain/entities/User";
import { RefreshToken } from "../../../../src/domain/entities/RefreshToken";

const mockUserId = "valid-user-id";
const mockUserRole = "USER";
const mockSecret = "SECRET12345";
const mockToken = "123456";
const mockAccessToken = "mock-jwt-access-token";
const mockRefreshTokenId = "mock-refresh-token-id";

const mockUserBase = {
  id: mockUserId,
  email: "test@user.com",
  role: mockUserRole,
  twoFactorSecret: mockSecret,
  name: "Test User",
  password: "hashedpassword",
  age: 30,
  address: "Rua Teste",
  cep: "00000000",
  cpf: "00000000000",
  gender: "NOTINFORM",
  profileImage: "default.png",
  latitude: 0,
  longitude: 0,
  isTwoFactorEnabled: false,
};

const mockFindUserByIdRepository = {
  findUserById: vi.fn(),
};

const mockTotpProvider = {
  verifyToken: vi.fn(),
  generateSecret: vi.fn(),
};

const mockUpdateUserRepository = {
  updateUser: vi.fn(),
};

const mockDeleteManyRefreshTokenRepository = {
  deleteManyRefreshToken: vi.fn(),
};

const mockTokenProvider = {
  generateTokenUser: vi.fn(),
};

const mockCreateRefreshTokenRepository = {
  createRefreshToken: vi.fn(),
};

let verify2FAUserUseCase: Verify2FAUserUseCase;

describe("Verify2FAUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockTotpProvider.verifyToken.mockReturnValue(true);
    mockFindUserByIdRepository.findUserById.mockResolvedValue({
      ...mockUserBase,
      isTwoFactorEnabled: false,
    });

    mockTokenProvider.generateTokenUser.mockResolvedValue(mockAccessToken);
    mockCreateRefreshTokenRepository.createRefreshToken.mockResolvedValue({
      id: mockRefreshTokenId,
    } as RefreshToken);

    verify2FAUserUseCase = new Verify2FAUserUseCase(
      mockFindUserByIdRepository,
      mockTotpProvider,
      mockUpdateUserRepository,
      mockDeleteManyRefreshTokenRepository,
      mockTokenProvider,
      mockCreateRefreshTokenRepository
    );
  });

  it("deve ativar o 2FA, gerar tokens e retornar sucesso se o token for válido", async () => {
    const mockRequest = { userId: mockUserId, token: mockToken };

    const result = await verify2FAUserUseCase.execute(mockRequest);

    expect(mockTotpProvider.verifyToken).toHaveBeenCalledWith(
      mockToken,
      mockSecret
    );

    expect(mockUpdateUserRepository.updateUser).toHaveBeenCalledTimes(1);
    const updatedUserArgument = mockUpdateUserRepository.updateUser.mock
      .calls[0]![0] as User;
    expect(updatedUserArgument.isTwoFactorEnabled).toBe(true);

    expect(
      mockDeleteManyRefreshTokenRepository.deleteManyRefreshToken
    ).toHaveBeenCalledWith(mockUserId);
    expect(mockTokenProvider.generateTokenUser).toHaveBeenCalled();
    expect(
      mockCreateRefreshTokenRepository.createRefreshToken
    ).toHaveBeenCalled();

    expect(result.accessToken).toBe(mockAccessToken);
    expect(result.refreshToken).toBe(mockRefreshTokenId);
  });

  it("deve apenas gerar novos tokens se o 2FA já estiver ativo", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue({
      ...mockUserBase,
      isTwoFactorEnabled: true,
    });

    const mockRequest = { userId: mockUserId, token: mockToken };

    await verify2FAUserUseCase.execute(mockRequest);

    expect(mockUpdateUserRepository.updateUser).not.toHaveBeenCalled();

    expect(
      mockDeleteManyRefreshTokenRepository.deleteManyRefreshToken
    ).toHaveBeenCalledTimes(1);
    expect(mockTokenProvider.generateTokenUser).toHaveBeenCalledTimes(1);
  });

  it("deve lançar UserNotFoundError se o usuário não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    await expect(
      verify2FAUserUseCase.execute({ userId: "non-existent", token: mockToken })
    ).rejects.toThrow(UserNotFoundError);
    expect(mockTotpProvider.verifyToken).not.toHaveBeenCalled();
  });

  it("deve lançar Verify2FAUserError se o segredo não estiver configurado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue({
      ...mockUserBase,
      twoFactorSecret: null,
    });
    await expect(
      verify2FAUserUseCase.execute({ userId: mockUserId, token: mockToken })
    ).rejects.toThrow(Verify2FAUserError);
    expect(mockTotpProvider.verifyToken).not.toHaveBeenCalled();
  });

  it("deve lançar IncorrectToken2FAUserError se o token for inválido", async () => {
    mockTotpProvider.verifyToken.mockReturnValue(false);
    await expect(
      verify2FAUserUseCase.execute({ userId: mockUserId, token: mockToken })
    ).rejects.toThrow(IncorrectToken2FAUserError);
    expect(mockUpdateUserRepository.updateUser).not.toHaveBeenCalled();
    expect(mockTokenProvider.generateTokenUser).not.toHaveBeenCalled();
  });
});
