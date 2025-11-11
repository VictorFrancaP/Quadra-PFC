import { describe, it, expect, vi, beforeEach } from "vitest";
import { ResetPasswordUserUseCase } from "../../../../src/application/usecases/user/password-reset/ResetPasswordUserUseCase";
import {
  ExpiredTimeUserError,
  TokenUserError,
} from "../../../../src/shared/errors/user-error/TokenUserError";
import { PasswordUserSameError } from "../../../../src/shared/errors/user-error/CredentialsUserError";
import { User } from "../../../../src/domain/entities/User";

const mockToken = "valid-reset-token-123";
const mockNewPassword = "NewSecurePassword456!";
const mockHashedNewPassword = "new_hashed_password";
const mockOldHashedPassword = "old_hashed_password";
const mockExpiredDate = new Date("2025-11-10T10:00:00Z");

const mockUserBase = {
  id: "user-id-123",
  name: "Reset User",
  email: "reset@example.com",
  password: mockOldHashedPassword,
  resetToken: mockToken,
  resetTokenExpired: mockExpiredDate,
};

const mockFindUserResetTokenRepository = { findUserToken: vi.fn() };
const mockDayJsProvider = {
  add: vi.fn(),
  verify: vi.fn(),
  now: vi.fn(),
  parse: vi.fn(),
  diffInHours: vi.fn(),
  startOf: vi.fn(),
  endOf: vi.fn(),
  isBetween: vi.fn(),
};
const mockCompareProvider = { comparePassword: vi.fn() };
const mockHashProvider = { hashPassword: vi.fn() };
const mockUpdateUserRepository = { updateUser: vi.fn() };
const mockMailProvider = {
  send: vi.fn(),
  linkConfirm: `${process.env.FRONT_HOST}/auth/user/cadastrar`,
  linkResetPassword: `${process.env.FRONT_HOST}/user/reset-password`,
  linkPlatform: "http://localhost:3000/",
};
const mockPictureConfig = {
  logoMain: `${process.env.CLOUDINARY_LOGO_MAIN}`,
  profileImageDefault: `${process.env.CLOUDINARY_PROFILE_DEFAULT}`,
  soccerDefault: [`${process.env.CLOUDINARY_SOCCER_DEFAULT}`],
};

let resetPasswordUserUseCase: ResetPasswordUserUseCase;

describe("ResetPasswordUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserResetTokenRepository.findUserToken.mockResolvedValue(
      mockUserBase as User
    );
    mockDayJsProvider.verify.mockResolvedValue(false);
    mockCompareProvider.comparePassword.mockResolvedValue(false);
    mockHashProvider.hashPassword.mockResolvedValue(mockHashedNewPassword);

    resetPasswordUserUseCase = new ResetPasswordUserUseCase(
      mockFindUserResetTokenRepository,
      mockDayJsProvider,
      mockCompareProvider,
      mockHashProvider,
      mockUpdateUserRepository,
      mockMailProvider,
      mockPictureConfig
    );
  });

  it("deve resetar a senha, limpar o token de reset e enviar o email de confirmação", async () => {
    const mockRequest = { token: mockToken, password: mockNewPassword };

    await expect(
      resetPasswordUserUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(mockFindUserResetTokenRepository.findUserToken).toHaveBeenCalledWith(
      mockToken
    );

    expect(mockDayJsProvider.verify).toHaveBeenCalledWith(mockExpiredDate);

    expect(mockHashProvider.hashPassword).toHaveBeenCalledWith(mockNewPassword);

    expect(mockUpdateUserRepository.updateUser).toHaveBeenCalledTimes(1);

    const updatedUserArgument = mockUpdateUserRepository.updateUser.mock
      .calls[0]![0] as User;
    expect(updatedUserArgument.password).toBe(mockHashedNewPassword);
    expect(updatedUserArgument.resetToken).toBeNull();
    expect(updatedUserArgument.resetTokenExpired).toBeNull();
    expect(mockMailProvider.send).toHaveBeenCalledTimes(1);
    expect(mockMailProvider.send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Alteração de senha",
        content: expect.stringContaining(mockUserBase.name),
      })
    );
  });

  it("deve lançar TokenUserError se o token não for encontrado no DB", async () => {
    mockFindUserResetTokenRepository.findUserToken.mockResolvedValue(null);
    await expect(
      resetPasswordUserUseCase.execute({
        token: "invalid",
        password: mockNewPassword,
      })
    ).rejects.toThrow(TokenUserError);
    expect(mockDayJsProvider.verify).not.toHaveBeenCalled();
  });

  it("deve lançar TokenUserError se resetTokenExpired for nulo/indefinido (dado corrompido)", async () => {
    mockFindUserResetTokenRepository.findUserToken.mockResolvedValue({
      ...mockUserBase,
      resetTokenExpired: null,
    });
    await expect(
      resetPasswordUserUseCase.execute({
        token: mockToken,
        password: mockNewPassword,
      })
    ).rejects.toThrow(TokenUserError);
    expect(mockDayJsProvider.verify).not.toHaveBeenCalled();
  });

  it("deve lançar ExpiredTimeUserError se o token estiver expirado", async () => {
    mockDayJsProvider.verify.mockResolvedValue(true);
    await expect(
      resetPasswordUserUseCase.execute({
        token: mockToken,
        password: mockNewPassword,
      })
    ).rejects.toThrow(ExpiredTimeUserError);
    expect(mockCompareProvider.comparePassword).not.toHaveBeenCalled();
    expect(mockHashProvider.hashPassword).not.toHaveBeenCalled();
  });

  it("deve lançar PasswordUserSameError se a nova senha for igual à senha atual", async () => {
    mockCompareProvider.comparePassword.mockResolvedValue(true);

    await expect(
      resetPasswordUserUseCase.execute({
        token: mockToken,
        password: mockNewPassword,
      })
    ).rejects.toThrow(PasswordUserSameError);

    expect(mockHashProvider.hashPassword).not.toHaveBeenCalled();
    expect(mockUpdateUserRepository.updateUser).not.toHaveBeenCalled();
    expect(mockMailProvider.send).not.toHaveBeenCalled();
  });
});
