import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteUserUseCase } from "../../../../src/application/usecases/user/delete/DeleteUserUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { User } from "../../../../src/domain/entities/User";

const mockUserId = "user-to-delete-id";
const mockExistingUser = {
  id: mockUserId,
  email: "delete@test.com",
  name: "User to Delete",
  role: "USER",
};

const mockFindUserByIdRepository = {
  findUserById: vi.fn(),
};

const mockDeleteUserRepository = {
  deleteUser: vi.fn(),
};

let deleteUserUseCase: DeleteUserUseCase;

describe("DeleteUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockExistingUser as User
    );

    deleteUserUseCase = new DeleteUserUseCase(
      mockFindUserByIdRepository,
      mockDeleteUserRepository
    );
  });


  it("deve deletar o usuário com sucesso se ele existir", async () => {
    const mockRequest = { userId: mockUserId };

    await expect(
      deleteUserUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(
      mockUserId
    );

    expect(mockDeleteUserRepository.deleteUser).toHaveBeenCalledTimes(1);
    expect(mockDeleteUserRepository.deleteUser).toHaveBeenCalledWith(
      mockUserId
    );
  });

  it("deve lançar UserNotFoundError se o usuário não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);

    const mockRequest = { userId: "non-existent-id" };

    await expect(deleteUserUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(
      "non-existent-id"
    );
    expect(mockDeleteUserRepository.deleteUser).not.toHaveBeenCalled();
  });
});
