import { describe, it, expect, vi, beforeEach } from "vitest";
import { RequestUserResetPasswordUseCase } from "../../../../src/application/usecases/user/password-reset/RequestUserResetPasswordUseCase";
import { SendMailUserNotFoundError } from "../../../../src/shared/errors/send-mail-error/SendMailUserNotFoundError";
import {
  AccountUserIsBlockError,
  AccountUserIsLockedError,
} from "../../../../src/shared/errors/user-error/AccountUserIsLockedError";

const mockUserEmail = "user@example.com";
const mockUserName = "Test User";
const mockExistingToken = "existing-token-123";
const mockNewToken = "new-token-456";
const mockLockTime = new Date("2025-10-10T10:30:00.000Z");
const mockExpiredTime = new Date("2025-10-10T11:00:00.000Z");
const mockUserBase = {
  id: "user-id-123",
  email: mockUserEmail,
  name: mockUserName,
  accountBlock: false,
  lockAccount: null,
  resetToken: null,
  resetTokenExpired: null,
};

const mockFindUserByEmaiRepository = { findUserByEmail: vi.fn() };
const mockLockUserAccountRepository = { isLockedUserAccount: vi.fn() };
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
const mockMailProvider = {
  send: vi.fn(),
  linkConfirm: `${process.env.FRONT_HOST}/auth/user/cadastrar`,
  linkResetPassword: `${process.env.FRONT_HOST}/user/reset-password`,
  linkPlatform: "http://localhost:3000/",
};
const mockResetTokenProvider = { generateToken: vi.fn() };
const mockUpdateUserRepository = { updateUser: vi.fn() };
const mockPictureConfig = {
  logoMain: `${process.env.CLOUDINARY_LOGO_MAIN}`,
  profileImageDefault: `${process.env.CLOUDINARY_PROFILE_DEFAULT}`,
  soccerDefault: [`${process.env.CLOUDINARY_SOCCER_DEFAULT}`],
};

let requestUserResetPasswordUseCase: RequestUserResetPasswordUseCase;

describe("RequestUserResetPasswordUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByEmaiRepository.findUserByEmail.mockResolvedValue({
      ...mockUserBase,
    });
    mockLockUserAccountRepository.isLockedUserAccount.mockResolvedValue(false);
    mockResetTokenProvider.generateToken.mockResolvedValue(mockNewToken);
    mockDayJsProvider.add.mockResolvedValue(mockExpiredTime);
    mockDayJsProvider.verify.mockResolvedValue(true);

    requestUserResetPasswordUseCase = new RequestUserResetPasswordUseCase(
      mockFindUserByEmaiRepository,
      mockLockUserAccountRepository,
      mockDayJsProvider,
      mockMailProvider,
      mockResetTokenProvider,
      mockUpdateUserRepository,
      mockPictureConfig
    );
  });

  it("deve criar um novo token, salvar no DB e enviar o email com o novo link", async () => {
    const mockRequest = { email: mockUserEmail };
    mockFindUserByEmaiRepository.findUserByEmail.mockResolvedValue({
      ...mockUserBase,
      resetTokenExpired: null,
    });

    await expect(
      requestUserResetPasswordUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(mockResetTokenProvider.generateToken).toHaveBeenCalledTimes(1);

    expect(mockDayJsProvider.add).toHaveBeenCalledWith(30, "minute");

    expect(mockUpdateUserRepository.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        resetToken: mockNewToken,
        resetTokenExpired: mockExpiredTime,
      })
    );

    expect(mockMailProvider.send).toHaveBeenCalledTimes(1);
    expect(mockMailProvider.send).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining(
          `${mockMailProvider.linkResetPassword}/${mockNewToken}`
        ),
        subject: "Redefinição de senha",
      })
    );
  });

  it("deve reenviar o email com o token existente se ele NÃO tiver expirado", async () => {
    const userWithActiveToken = {
      ...mockUserBase,
      resetToken: mockExistingToken,
      resetTokenExpired: mockLockTime,
    };
    mockFindUserByEmaiRepository.findUserByEmail.mockResolvedValue(
      userWithActiveToken
    );

    mockDayJsProvider.verify.mockResolvedValue(false);

    await expect(
      requestUserResetPasswordUseCase.execute({ email: mockUserEmail })
    ).resolves.toBeUndefined();

    expect(mockDayJsProvider.verify).toHaveBeenCalledWith(mockLockTime);

    expect(mockResetTokenProvider.generateToken).not.toHaveBeenCalled();
    expect(mockDayJsProvider.add).not.toHaveBeenCalled();

    expect(mockUpdateUserRepository.updateUser).not.toHaveBeenCalled();

    expect(mockMailProvider.send).toHaveBeenCalledTimes(1);
    expect(mockMailProvider.send).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining(
          `${mockMailProvider.linkResetPassword}/${mockExistingToken}`
        ),
      })
    );
  });

  it("deve lançar SendMailUserNotFoundError se o email não for encontrado", async () => {
    mockFindUserByEmaiRepository.findUserByEmail.mockResolvedValue(null);
    await expect(
      requestUserResetPasswordUseCase.execute({ email: "nonexistent@mail.com" })
    ).rejects.toThrow(SendMailUserNotFoundError);
    expect(mockResetTokenProvider.generateToken).not.toHaveBeenCalled();
  });

  it("deve lançar AccountUserIsBlockError se a conta estiver permanentemente bloqueada", async () => {
    mockFindUserByEmaiRepository.findUserByEmail.mockResolvedValue({
      ...mockUserBase,
      accountBlock: true,
    });
    await expect(
      requestUserResetPasswordUseCase.execute({ email: mockUserEmail })
    ).rejects.toThrow(AccountUserIsBlockError);
  });

  it("deve lançar AccountUserIsLockedError se a conta estiver temporariamente bloqueada", async () => {
    mockLockUserAccountRepository.isLockedUserAccount.mockResolvedValue(true);
    await expect(
      requestUserResetPasswordUseCase.execute({ email: mockUserEmail })
    ).rejects.toThrow(AccountUserIsLockedError);
  });
});
