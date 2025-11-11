import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateUserUseCase } from "../../../../src/application/usecases/user/create/CreateUserUseCase";
import { UserFoundError } from "../../../../src/shared/errors/user-error/UserFoundError";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { User } from "../../../../src/domain/entities/User";
import { welcomeTemplate } from "../../../../src/shared/providers/templates/welcomeTemplate";
import { userGender } from "../../../../src/domain/entities/User";

const mockFindUserByCPFRepository = {
  findUserByCPF: vi.fn(),
};

const mockRedisProvider = {
  dataGet: vi.fn(),
  dataSet: vi.fn(),
  dataDelete: vi.fn(),
};

const mockHashProvider = {
  hashPassword: vi.fn(),
  comparePassword: vi.fn(),
};

const mockOpenCageProvider = {
  getCoordinates: vi.fn(),
};

const mockPictureConfig = {
  logoMain: "http://link.para.logo/main.png",
  profileImageDefault: "http://link.para.profile/default.png",
  soccerDefault: ["http://link.para.soccer/default.png"],
};

const mockCreateUserRepository = {
  createUser: vi.fn(),
};

const mockMailProvider = {
  send: vi.fn(),
  linkConfirm: `${process.env.FRONT_HOST}/auth/user/cadastrar`,
  linkResetPassword: `${process.env.FRONT_HOST}/user/reset-password`,
  linkPlatform: "http://localhost:3000/",
};

const mockRequestData = {
  token: "valid-temp-token",
  cpf: "123.456.789-00",
  password: "NewSecurePassword123!",
  age: 30,
  address: "Rua Teste, 123",
  cep: "01000-000",
  gender: "MALE" as userGender,
};

const mockRedisData = { name: "João Teste", email: "joao@teste.com" };
const mockRedisDataString = JSON.stringify(mockRedisData);

const mockCreatedUser = new User(
  mockRedisData.name,
  mockRedisData.email,
  "hashed_password",
  mockRequestData.age,
  "USER",
  mockRequestData.address,
  mockRequestData.cep,
  mockRequestData.cpf,
  mockRequestData.gender,
  mockPictureConfig.profileImageDefault,
  -23.5,
  -46.6
);

let createUserUseCase: CreateUserUseCase;

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByCPFRepository.findUserByCPF.mockResolvedValue(null);
    mockRedisProvider.dataGet.mockResolvedValue(mockRedisDataString);
    mockHashProvider.hashPassword.mockResolvedValue("hashed_password");
    mockOpenCageProvider.getCoordinates.mockResolvedValue({
      latitude: -23.5,
      longitude: -46.6,
    });
    mockCreateUserRepository.createUser.mockResolvedValue(mockCreatedUser);

    createUserUseCase = new CreateUserUseCase(
      mockFindUserByCPFRepository,
      mockRedisProvider,
      mockHashProvider,
      mockOpenCageProvider,
      mockPictureConfig,
      mockCreateUserRepository,
      mockMailProvider
    );
  });

  it("deve criar o usuário e disparar o email de boas-vindas após o sucesso", async () => {
    const result = await createUserUseCase.execute(mockRequestData);

    expect(mockFindUserByCPFRepository.findUserByCPF).toHaveBeenCalledWith(
      mockRequestData.cpf
    );

    expect(mockRedisProvider.dataGet).toHaveBeenCalledWith(
      "pending_user_created:valid-temp-token"
    );

    expect(mockHashProvider.hashPassword).toHaveBeenCalledWith(
      mockRequestData.password
    );

    expect(mockOpenCageProvider.getCoordinates).toHaveBeenCalledWith(
      mockRequestData.cep
    );

    expect(mockCreateUserRepository.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockRedisData.email,
        password: "hashed_password",
        profileImage: mockPictureConfig.profileImageDefault,
        latitude: -23.5,
      })
    );

    expect(mockRedisProvider.dataDelete).toHaveBeenCalledWith(
      "pending_user_created:valid-temp-token"
    );

    expect(mockMailProvider.send).toHaveBeenCalledWith({
      email: mockCreatedUser.email,
      content: welcomeTemplate(
        mockCreatedUser.name,
        mockPictureConfig.logoMain
      ),
      subject: "Bem-vindo ao nosso sistema de aluguel de quadras!",
    });

    expect(result).toEqual(mockCreatedUser);
  });

  it("não deve permitir a criação se o CPF já estiver cadastrado no DB", async () => {
    mockFindUserByCPFRepository.findUserByCPF.mockResolvedValue({
      id: "any-id",
      cpf: mockRequestData.cpf,
    });

    await expect(createUserUseCase.execute(mockRequestData)).rejects.toThrow(
      UserFoundError
    );
    await expect(createUserUseCase.execute(mockRequestData)).rejects.toThrow(
      "CPF"
    );

    expect(mockRedisProvider.dataGet).not.toHaveBeenCalled();
    expect(mockCreateUserRepository.createUser).not.toHaveBeenCalled();
    expect(mockMailProvider.send).not.toHaveBeenCalled();
  });

  it("não deve permitir a criação se o token for inválido ou tiver expirado (Redis key não existe)", async () => {
    mockRedisProvider.dataGet.mockResolvedValue(null);

    await expect(createUserUseCase.execute(mockRequestData)).rejects.toThrow(
      UserNotFoundError
    );

    expect(mockHashProvider.hashPassword).not.toHaveBeenCalled();
    expect(mockOpenCageProvider.getCoordinates).not.toHaveBeenCalled();
    expect(mockCreateUserRepository.createUser).not.toHaveBeenCalled();
    expect(mockRedisProvider.dataDelete).not.toHaveBeenCalled();
    expect(mockMailProvider.send).not.toHaveBeenCalled();
  });
});
