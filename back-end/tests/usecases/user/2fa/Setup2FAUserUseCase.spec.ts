import { describe, it, expect, vi, beforeEach } from "vitest";
import { Setup2FAUserUseCase } from "../../../../src/application/usecases/user/2fa/Setup2FAUserUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { Setup2FAUserError } from "../../../../src/shared/errors/user-error/Setup2FAUserError";
import { User } from "../../../../src/domain/entities/User";

const mockUserId = "user-test-id";
const mockUserEmail = "user@test.com";

const mockExistingUser = {
  id: mockUserId,
  email: mockUserEmail,
  isTwoFactorEnabled: false,
  twoFactorSecret: null,
  name: "Test User",
  password: "hashedpassword",
  age: 30,
  role: "USER",
  address: "Rua Teste",
  cep: "00000000",
  cpf: "00000000000",
  gender: "NOTINFORM",
  profileImage: "default.png",
  latitude: 0,
  longitude: 0,
};

const mockSecretData = {
  secret: "JBSWY3DPEHPK3PXP",
  otpAuthUrl: "otpauth://totp/MyPlat:user@test.com?secret=JBSWY3DPEHPK3PXP",
};

const mockFindUserByIdRepository = {
  findUserById: vi.fn(),
};

const mockTotpProvider = {
  generateSecret: vi.fn(),
  verifyToken: vi.fn(),
};

const mockUpdateUserRepository = {
  updateUser: vi.fn(),
};

let setup2FAUserUseCase: Setup2FAUserUseCase;

describe("Setup2FAUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue(mockExistingUser);
    mockTotpProvider.generateSecret.mockReturnValue(mockSecretData);

    setup2FAUserUseCase = new Setup2FAUserUseCase(
      mockFindUserByIdRepository,
      mockTotpProvider,
      mockUpdateUserRepository
    );
  });

  it("deve gerar o segredo e salvar a chave no usuário para setup", async () => {
    const mockRequest = { userId: mockUserId };

    const result = await setup2FAUserUseCase.execute(mockRequest);

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(
      mockUserId
    );

    expect(mockTotpProvider.generateSecret).toHaveBeenCalledWith(mockUserEmail);

    expect(mockUpdateUserRepository.updateUser).toHaveBeenCalledTimes(1);

    const updatedUserArgument = mockUpdateUserRepository.updateUser.mock
      .calls[0]![0] as User;

    expect(updatedUserArgument.twoFactorSecret).toBe(mockSecretData.secret);

    expect(result).toEqual({ otpAuthUrl: mockSecretData.otpAuthUrl });
  });

  it("deve lançar UserNotFoundError se o usuário não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);

    const mockRequest = { userId: "non-existent-id" };

    await expect(setup2FAUserUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );

    expect(mockTotpProvider.generateSecret).not.toHaveBeenCalled();
    expect(mockUpdateUserRepository.updateUser).not.toHaveBeenCalled();
  });

  it("deve lançar Setup2FAUserError se o 2FA já estiver ativo", async () => {
    const userWith2FA = { ...mockExistingUser, isTwoFactorEnabled: true };
    mockFindUserByIdRepository.findUserById.mockResolvedValue(userWith2FA);

    const mockRequest = { userId: mockUserId };

    await expect(setup2FAUserUseCase.execute(mockRequest)).rejects.toThrow(
      Setup2FAUserError
    );

    expect(mockTotpProvider.generateSecret).not.toHaveBeenCalled();
    expect(mockUpdateUserRepository.updateUser).not.toHaveBeenCalled();
  });
});
