import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindUserUseCase } from "../../../../src/application/usecases/user/list/FindUserUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedError } from "../../../../src/shared/errors/user-error/UserAccessDeniedError";
import { IUserData } from "../../../../src/domain/repositories/user/IFindUserPartialByEmailRepositories";
import { User } from "../../../../src/domain/entities/User";

const mockAdminId = "admin-id-123";
const mockTargetEmail = "target@user.com";
const mockPartialUserData: IUserData = {
  id: "target-id-456",
  name: "Target User",
  email: mockTargetEmail,
  role: "USER",
  accountBlock: false,
};

const mockAdminUser: Partial<User> = { id: mockAdminId, role: "ADMIN" };
const mockRegularUser: Partial<User> = { id: "regular-id", role: "USER" };

const mockFindUserPartialByEmailRepository = {
  findPartialDataByEmail: vi.fn(),
};

const mockFindUserByIdRepository = {
  findUserById: vi.fn(),
};

let findUserUseCase: FindUserUseCase;

describe("FindUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserPartialByEmailRepository.findPartialDataByEmail.mockResolvedValue(
      mockPartialUserData
    );
    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockAdminUser as User
    );

    findUserUseCase = new FindUserUseCase(
      mockFindUserPartialByEmailRepository,
      mockFindUserByIdRepository
    );
  });

  it("deve retornar dados parciais quando o solicitante é ADMIN e o usuário alvo existe", async () => {
    const mockRequest = { userId: mockAdminId, email: mockTargetEmail };

    const result = await findUserUseCase.execute(mockRequest);

    expect(
      mockFindUserPartialByEmailRepository.findPartialDataByEmail
    ).toHaveBeenCalledWith(mockTargetEmail);

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(
      mockAdminId
    );

    expect(result).toEqual(mockPartialUserData);
  });

  it("deve lançar UserNotFoundError se o usuário alvo não for encontrado pelo email", async () => {
    mockFindUserPartialByEmailRepository.findPartialDataByEmail.mockResolvedValue(
      null
    );

    const mockRequest = { userId: mockAdminId, email: "non-existent@test.com" };

    await expect(findUserUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );

    expect(mockFindUserByIdRepository.findUserById).not.toHaveBeenCalled();
  });

  it("deve lançar UserNotFoundError se o solicitante não for encontrado (Token inválido)", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);

    const mockRequest = { userId: "invalid-id", email: mockTargetEmail };

    await expect(findUserUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );

    expect(
      mockFindUserPartialByEmailRepository.findPartialDataByEmail
    ).toHaveBeenCalledTimes(1);
  });

  it("deve lançar UserAccessDeniedError se o solicitante não for ADMIN (role = USER)", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockRegularUser as User
    );

    const mockRequest = {
      userId: mockRegularUser.id as string,
      email: mockTargetEmail,
    };

    await expect(findUserUseCase.execute(mockRequest)).rejects.toThrow(
      UserAccessDeniedError
    );

    expect(
      mockFindUserPartialByEmailRepository.findPartialDataByEmail
    ).toHaveBeenCalledTimes(1);
    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledTimes(1);
  });
});
