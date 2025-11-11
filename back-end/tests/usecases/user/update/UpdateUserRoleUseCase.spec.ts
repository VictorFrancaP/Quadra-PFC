import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateUserRoleUseCase } from "../../../../src/application/usecases/user/update/UpdateUserRoleUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import {
  UserOrderNotApprovedError,
  UserOrderNotFoundError,
} from "../../../../src/shared/errors/user-error/UserOrderError";
import { User } from "../../../../src/domain/entities/User";
import {
  UserAccessDeniedRoleSameError,
  UserAccessDeniedRoleUpdateError,
} from "../../../../src/shared/errors/user-error/UserAccessDeniedError";
import { userPermissions } from "@prisma/client";

const mockAdminId = "admin-id-123";
const mockTargetUserId = "target-user-id";
const mockNewRole = "OWNER" as userPermissions;

const mockAdminUser = { id: mockAdminId, role: "ADMIN" };
const mockTargetUserBase = { id: mockTargetUserId, role: "USER" };
const mockTargetUserOwner = { id: mockTargetUserId, role: "OWNER" };

const mockApprovedOrder = { id: "order-1", status: "APPROVED" };
const mockPendingOrder = { id: "order-2", status: "PENDING" };

const mockFindUserByIdRepository = { findUserById: vi.fn() };
const mockFindUserOrderRepository = { findUserOrder: vi.fn() };
const mockUpdateUserRepository = { updateUser: vi.fn() };

let updateUserRoleUseCase: UpdateUserRoleUseCase;

describe("UpdateUserRoleUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockImplementation((id) => {
      if (id === mockAdminId) return Promise.resolve(mockAdminUser as User);
      if (id === mockTargetUserId)
        return Promise.resolve(mockTargetUserBase as User);
      return Promise.resolve(null);
    });
    mockFindUserOrderRepository.findUserOrder.mockResolvedValue(
      mockApprovedOrder
    );
    mockUpdateUserRepository.updateUser.mockResolvedValue(undefined);

    updateUserRoleUseCase = new UpdateUserRoleUseCase(
      mockFindUserByIdRepository,
      mockFindUserOrderRepository,
      mockUpdateUserRepository
    );
  });

  it("deve atualizar o papel do usuário para a nova role quando todas as condições forem atendidas (ADMIN, USER, Order Approved)", async () => {
    const mockRequest = {
      userId: mockAdminId,
      id: mockTargetUserId,
      newRole: mockNewRole,
    };

    await expect(
      updateUserRoleUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(mockFindUserOrderRepository.findUserOrder).toHaveBeenCalledWith(
      mockTargetUserId
    );

    expect(mockUpdateUserRepository.updateUser).toHaveBeenCalledTimes(1);

    const updatedUserArgument = mockUpdateUserRepository.updateUser.mock
      .calls[0]![0] as User;
    expect(updatedUserArgument.role).toBe(mockNewRole);
  });

  it("deve lançar UserNotFoundError se o solicitante (ADMIN) não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValueOnce(null);
    const mockRequest = {
      userId: "non-existent",
      id: mockTargetUserId,
      newRole: mockNewRole,
    };

    await expect(updateUserRoleUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );
    expect(mockFindUserOrderRepository.findUserOrder).not.toHaveBeenCalled();
  });

  it("deve lançar UserAccessDeniedRoleUpdateError se o solicitante não for ADMIN", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValueOnce(
      mockTargetUserBase as User
    );

    const mockRequest = {
      userId: mockTargetUserId,
      id: mockTargetUserId,
      newRole: mockNewRole,
    };

    await expect(updateUserRoleUseCase.execute(mockRequest)).rejects.toThrow(
      UserAccessDeniedRoleUpdateError
    );
    expect(mockFindUserOrderRepository.findUserOrder).not.toHaveBeenCalled();
  });

  it("deve lançar UserAccessDeniedRoleSameError se o alvo já for ADMIN", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValueOnce(
      mockAdminUser as User
    );
    mockFindUserByIdRepository.findUserById.mockResolvedValueOnce(
      mockTargetUserOwner as User
    );

    const mockRequest = {
      userId: mockAdminId,
      id: mockTargetUserId,
      newRole: mockNewRole,
    };

    await expect(updateUserRoleUseCase.execute(mockRequest)).rejects.toThrow(
      UserAccessDeniedRoleSameError
    );
    expect(mockFindUserOrderRepository.findUserOrder).not.toHaveBeenCalled();
  });

  it("deve lançar UserOrderNotFoundError se o alvo não tiver nenhuma solicitação (order)", async () => {
    mockFindUserOrderRepository.findUserOrder.mockResolvedValue(null);

    const mockRequest = {
      userId: mockAdminId,
      id: mockTargetUserId,
      newRole: mockNewRole,
    };

    await expect(updateUserRoleUseCase.execute(mockRequest)).rejects.toThrow(
      UserOrderNotFoundError
    );
    expect(mockUpdateUserRepository.updateUser).not.toHaveBeenCalled();
  });

  it("deve lançar UserOrderNotApprovedError se a solicitação (order) não estiver aprovada", async () => {
    mockFindUserOrderRepository.findUserOrder.mockResolvedValue(
      mockPendingOrder
    );

    const mockRequest = {
      userId: mockAdminId,
      id: mockTargetUserId,
      newRole: mockNewRole,
    };

    await expect(updateUserRoleUseCase.execute(mockRequest)).rejects.toThrow(
      UserOrderNotApprovedError
    );
    expect(mockUpdateUserRepository.updateUser).not.toHaveBeenCalled();
  });
});
