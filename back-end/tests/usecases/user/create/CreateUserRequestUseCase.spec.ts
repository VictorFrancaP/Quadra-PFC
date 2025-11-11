import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateUserRequestUseCase } from "../../../../src/application/usecases/user/create/CreateUserRequestUseCase";
import { UserFoundError } from "../../../../src/shared/errors/user-error/UserFoundError";
import { LimitRatingSendMailError } from "../../../../src/shared/errors/send-mail-error/LimitRatingSendMailError";
import { confirmEmailTemplate } from "../../../../src/shared/providers/templates/confirmEmailTemplate";

const mockFindUserByEmailRepository = {
  findUserByEmail: vi.fn(),
};

const mockResetTokenProvider = {
  generateToken: vi.fn(),
};

const mockRedisProvider = {
  dataGet: vi.fn(),
  dataSet: vi.fn(),
  dataDelete: vi.fn(),
};

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

const mockRequestData = {
  name: "Teste User",
  email: "test@example.com",
  password: "SecurePassword123",
};

let createUserRequestUseCase: CreateUserRequestUseCase;

describe("CreateUserRequestUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByEmailRepository.findUserByEmail.mockResolvedValue(null);
    mockRedisProvider.dataGet.mockResolvedValue(null);
    mockResetTokenProvider.generateToken.mockResolvedValue(
      "fake-crypto-token-123"
    );

    createUserRequestUseCase = new CreateUserRequestUseCase(
      mockFindUserByEmailRepository,
      mockResetTokenProvider,
      mockRedisProvider,
      mockMailProvider,
      mockPictureConfig
    );
  });

  it("deve criar uma solicitação e enviar o email com sucesso", async () => {
    await expect(
      createUserRequestUseCase.execute(mockRequestData)
    ).resolves.toBeUndefined();

    expect(mockFindUserByEmailRepository.findUserByEmail).toHaveBeenCalledWith(
      mockRequestData.email
    );

    expect(mockRedisProvider.dataGet).toHaveBeenCalledWith(
      "pending_user_limited_request:test@example.com"
    );

    expect(mockResetTokenProvider.generateToken).toHaveBeenCalled();

    expect(mockRedisProvider.dataSet).toHaveBeenCalledTimes(2);

    expect(mockRedisProvider.dataSet).toHaveBeenCalledWith({
      key: "pending_user_created:fake-crypto-token-123",
      expiration: 900,
      values: {
        name: mockRequestData.name,
        email: mockRequestData.email,
        token: "fake-crypto-token-123",
      },
    });

    expect(mockRedisProvider.dataSet).toHaveBeenCalledWith({
      key: "pending_user_limited_request:test@example.com",
      expiration: 300,
      values: { value: "true" },
    });

    expect(mockMailProvider.send).toHaveBeenCalledWith({
      email: mockRequestData.email,
      content: confirmEmailTemplate(
        mockRequestData.name,
        `${mockMailProvider.linkConfirm}/fake-crypto-token-123`,
        mockPictureConfig.logoMain
      ),
      subject: "Confirmação de e-mail",
    });
  });

  it("não deve permitir a criação se o email já estiver registrado", async () => {
    mockFindUserByEmailRepository.findUserByEmail.mockResolvedValue({
      id: "any-id",
      email: mockRequestData.email,
    });

    await expect(
      createUserRequestUseCase.execute(mockRequestData)
    ).rejects.toThrow(UserFoundError);
    await expect(
      createUserRequestUseCase.execute(mockRequestData)
    ).rejects.toThrow("e-mail");

    expect(mockRedisProvider.dataGet).not.toHaveBeenCalled();
    expect(mockMailProvider.send).not.toHaveBeenCalled();
  });

  it("não deve permitir a solicitação se o limite de taxa de email for excedido (Redis lock)", async () => {
    mockRedisProvider.dataGet.mockResolvedValue("true");

    await expect(
      createUserRequestUseCase.execute(mockRequestData)
    ).rejects.toThrow(LimitRatingSendMailError);

    expect(mockResetTokenProvider.generateToken).not.toHaveBeenCalled();
    expect(mockRedisProvider.dataSet).not.toHaveBeenCalled();
    expect(mockMailProvider.send).not.toHaveBeenCalled();
  });
});
