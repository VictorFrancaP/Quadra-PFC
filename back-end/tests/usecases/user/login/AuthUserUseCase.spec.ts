import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthUserUseCase } from "../../../../src/application/usecases/user/login/AuthUserUseCase";
import { RefreshToken } from "../../../../src/domain/entities/RefreshToken";
import { CredentialsUserError } from "../../../../src/shared/errors/user-error/CredentialsUserError";
import {
  AccountUserIsBlockError,
  AccountUserIsLockedError,
  AccountUserIsLockedNowError,
} from "../../../../src/shared/errors/user-error/AccountUserIsLockedError";

const mockUserId = "test-user-id";
const mockUserEmail = "user@example.com";
const mockPassword = "securepassword";
const mockAccessToken = "mock-jwt-access-token";
const mockRefreshTokenId = "mock-refresh-token-id";

const mockUserBase = {
  id: mockUserId,
  email: mockUserEmail,
  password: "hashedpassword",
  role: "USER",
  accountBlock: false,
  lockAccount: null,
  loginAttempts: 0,
  isTwoFactorEnabled: false,
};

const mockFindUserByEmailRepository = { findUserByEmail: vi.fn() };
const mockLockUserAccountRepository = { isLockedUserAccount: vi.fn() };
const mockCompareProvider = { comparePassword: vi.fn() };
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

const mockUpdateUserRepository = { updateUser: vi.fn() };
const mockDeleteManyRefreshTokenRepository = {
  deleteManyRefreshToken: vi.fn(),
};
const mockTokenProvider = { generateTokenUser: vi.fn() };
const mockCreateRefreshTokenRepository = { createRefreshToken: vi.fn() };

let authUserUseCase: AuthUserUseCase;

describe("AuthUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindUserByEmailRepository.findUserByEmail.mockResolvedValue({
      ...mockUserBase,
    });
    mockLockUserAccountRepository.isLockedUserAccount.mockResolvedValue(false);
    mockCompareProvider.comparePassword.mockResolvedValue(true);
    mockTokenProvider.generateTokenUser.mockResolvedValue(mockAccessToken);
    mockCreateRefreshTokenRepository.createRefreshToken.mockResolvedValue({
      id: mockRefreshTokenId,
    } as RefreshToken);

    authUserUseCase = new AuthUserUseCase(
      mockFindUserByEmailRepository,
      mockLockUserAccountRepository,
      mockCompareProvider,
      mockDayJsProvider,
      mockUpdateUserRepository,
      mockDeleteManyRefreshTokenRepository,
      mockTokenProvider,
      mockCreateRefreshTokenRepository
    );
  });

  it('deve retornar step: "setup_2fa" e tokens quando a autenticação for bem-sucedida e 2FA estiver desativado', async () => {
    const mockRequest = { email: mockUserEmail, password: mockPassword };

    const result = await authUserUseCase.execute(mockRequest);

    expect(mockUpdateUserRepository.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ loginAttempts: 0 })
    );

    expect(
      mockDeleteManyRefreshTokenRepository.deleteManyRefreshToken
    ).toHaveBeenCalledWith(mockUserId);
    expect(mockTokenProvider.generateTokenUser).toHaveBeenCalledTimes(1);

    expect(result.step).toBe("setup_2fa");
    expect(result.token).toBe(mockAccessToken);
  });

  it('deve retornar step: "2fa_required" quando a autenticação for bem-sucedida e 2FA estiver ATIVO', async () => {
    mockFindUserByEmailRepository.findUserByEmail.mockResolvedValue({
      ...mockUserBase,
      isTwoFactorEnabled: true,
    });

    const mockRequest = { email: mockUserEmail, password: mockPassword };

    const result = await authUserUseCase.execute(mockRequest);
    expect(mockUpdateUserRepository.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ loginAttempts: 0 })
    );

    expect(mockTokenProvider.generateTokenUser).not.toHaveBeenCalled();

    expect(result.step).toBe("2fa_required");
  });

  it("deve lançar CredentialsUserError se o usuário não for encontrado", async () => {
    mockFindUserByEmailRepository.findUserByEmail.mockResolvedValue(null);
    await expect(
      authUserUseCase.execute({
        email: "none@mail.com",
        password: mockPassword,
      })
    ).rejects.toThrow(CredentialsUserError);
  });

  it("deve lançar AccountUserIsBlockError se a conta estiver permanentemente bloqueada", async () => {
    mockFindUserByEmailRepository.findUserByEmail.mockResolvedValue({
      ...mockUserBase,
      accountBlock: true,
    });
    await expect(
      authUserUseCase.execute({ email: mockUserEmail, password: mockPassword })
    ).rejects.toThrow(AccountUserIsBlockError);
  });

  it("deve lançar AccountUserIsLockedError se a conta estiver temporariamente bloqueada", async () => {
    mockLockUserAccountRepository.isLockedUserAccount.mockResolvedValue(true);
    await expect(
      authUserUseCase.execute({ email: mockUserEmail, password: mockPassword })
    ).rejects.toThrow(AccountUserIsLockedError);
  });

  it("deve lançar CredentialsUserError e incrementar tentativas se a senha estiver incorreta", async () => {
    mockCompareProvider.comparePassword.mockResolvedValue(false);
    mockFindUserByEmailRepository.findUserByEmail.mockResolvedValue({
      ...mockUserBase,
      loginAttempts: 1,
    });

    await expect(
      authUserUseCase.execute({ email: mockUserEmail, password: "wrong" })
    ).rejects.toThrow(CredentialsUserError);

    expect(mockUpdateUserRepository.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ loginAttempts: 2, lockAccount: null })
    );
  });

  it("deve bloquear temporariamente a conta (30 min) se atingir 5 tentativas", async () => {
    mockCompareProvider.comparePassword.mockResolvedValue(false);
    mockFindUserByEmailRepository.findUserByEmail.mockResolvedValue({
      ...mockUserBase,
      loginAttempts: 4,
    });

    const mockLockTime = new Date();
    mockDayJsProvider.add.mockResolvedValue(mockLockTime);

    await expect(
      authUserUseCase.execute({ email: mockUserEmail, password: "wrong" })
    ).rejects.toThrow(AccountUserIsLockedNowError);

    expect(mockUpdateUserRepository.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ loginAttempts: 5, lockAccount: mockLockTime })
    );
    expect(mockDayJsProvider.add).toHaveBeenCalledWith(30, "minute");
  });

  it("deve bloquear permanentemente a conta se atingir 10 tentativas", async () => {
    mockCompareProvider.comparePassword.mockResolvedValue(false);
    mockFindUserByEmailRepository.findUserByEmail.mockResolvedValue({
      ...mockUserBase,
      loginAttempts: 9,
    });

    const mockLockTime = new Date();
    mockDayJsProvider.add.mockResolvedValue(mockLockTime);

    await expect(
      authUserUseCase.execute({ email: mockUserEmail, password: "wrong" })
    ).rejects.toThrow(AccountUserIsLockedNowError);

    expect(mockUpdateUserRepository.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ accountBlock: true })
    );

    expect(mockUpdateUserRepository.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ lockAccount: mockLockTime })
    );
  });
});
