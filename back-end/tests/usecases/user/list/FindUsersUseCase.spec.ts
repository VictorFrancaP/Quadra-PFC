import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindUsersUseCase } from "../../../../src/application/usecases/user/list/FindUsersUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { UsersNotFoundError } from "../../../../src/shared/errors/user-error/UserFoundError";
import { UsersAccessDeniedError } from "../../../../src/shared/errors/user-error/UserAccessDeniedError";
import { IUsersRequest } from "../../../../src/domain/repositories/user/IFindUsersRepositories";
import { User } from "../../../../src/domain/entities/User";

const mockAdminId = "admin-user-id";
const mockUserId = "regular-user-id";
const mockAdminUser = { id: mockAdminId, role: "ADMIN" };
const mockRegularUser = { id: mockUserId, role: "USER" };
const mockUsersList: IUsersRequest[] = [
  {
    id: "user1",
    name: "Alice",
    email: "alice@test.com",
    role: "USER",
    accountBlock: false,
  },
  {
    id: "user2",
    name: "Bob",
    email: "bob@test.com",
    role: "USER",
    accountBlock: false,
  },
];

const mockFindUserByIdRepository = {
  findUserById: vi.fn(),
};

const mockFindUsersRepository = {
  findUsersMany: vi.fn(),
};

let findUsersUseCase: FindUsersUseCase;

describe("FindUsersUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockAdminUser as User
    );
    mockFindUsersRepository.findUsersMany.mockResolvedValue(mockUsersList);

    findUsersUseCase = new FindUsersUseCase(
      mockFindUserByIdRepository,
      mockFindUsersRepository
    );
  });

  it("deve retornar a lista de usuários quando o solicitante é um ADMIN", async () => {
    const mockRequest = { userId: mockAdminId };

    const result = await findUsersUseCase.execute(mockRequest);

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(
      mockAdminId
    );

    expect(mockFindUsersRepository.findUsersMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsersList);
    expect(result.length).toBe(2);
  });

  it("deve lançar UserNotFoundError se o solicitante não for encontrado no DB", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);

    const mockRequest = { userId: "non-existent-admin" };

    await expect(findUsersUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );

    expect(mockFindUsersRepository.findUsersMany).not.toHaveBeenCalled();
  });

  it("deve lançar UsersAccessDeniedError se o solicitante não for um ADMIN", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockRegularUser as User
    );

    const mockRequest = { userId: mockUserId };

    await expect(findUsersUseCase.execute(mockRequest)).rejects.toThrow(
      UsersAccessDeniedError
    );

    expect(mockFindUsersRepository.findUsersMany).not.toHaveBeenCalled();
  });

  it("deve lançar UsersNotFoundError se nenhum usuário for encontrado no DB", async () => {
    mockFindUsersRepository.findUsersMany.mockResolvedValue([]);

    const mockRequest = { userId: mockAdminId };

    await expect(findUsersUseCase.execute(mockRequest)).rejects.toThrow(
      UsersNotFoundError
    );

    expect(mockFindUsersRepository.findUsersMany).toHaveBeenCalledTimes(1);
  });
});
