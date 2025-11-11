import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateUserOrderStatusUseCase } from "../../../../src/application/usecases/order/update/UpdateUserOrderStatusUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import {
  OrderErrorUpdated,
  UserOrderNotFoundError,
} from "../../../../src/shared/errors/user-error/UserOrderError";
import { User } from "../../../../src/domain/entities/User";
import { Order, orderStatus } from "../../../../src/domain/entities/Order";
import { UserAccessDeniedUpdateError } from "../../../../src/shared/errors/user-error/UserAccessDeniedError";

const mockAdminId = "admin-id-123";
const mockUserId = "regular-user-id";
const mockOrderId = "order-id-999";
const mockNewStatus = "APPROVED";
const mockOldStatus = "PENDING";
const mockAdminUser = { id: mockAdminId, role: "ADMIN" };
const mockRegularUser = { id: mockUserId, role: "USER" };
const mockOrderBase = { id: mockOrderId, status: mockOldStatus };
const mockOrderApproved = { id: mockOrderId, status: "APPROVED" };
const mockOrderDenied = { id: mockOrderId, status: "DENIED" };
const mockFindUserByIdRepository = { findUserById: vi.fn() };
const mockFindOrderByIdRepository = { findOrder: vi.fn() };
const mockUpdateUserOrderRepository = { updateOrder: vi.fn() };

let updateUserOrderStatusUseCase: UpdateUserOrderStatusUseCase;

describe("UpdateUserOrderStatusUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockAdminUser as User
    );
    mockFindOrderByIdRepository.findOrder.mockResolvedValue(
      mockOrderBase as Order
    );
    mockUpdateUserOrderRepository.updateOrder.mockResolvedValue(undefined);

    updateUserOrderStatusUseCase = new UpdateUserOrderStatusUseCase(
      mockFindUserByIdRepository,
      mockFindOrderByIdRepository,
      mockUpdateUserOrderRepository
    );
  });

  it("deve atualizar o status da ordem e salvar no banco de dados quando o ADMIN solicita", async () => {
    const mockRequest = {
      userId: "admin-id-123",
      id: "order-id-999",
      newStatus: "APPROVED" as orderStatus,
    };

    await expect(
      updateUserOrderStatusUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(
      mockAdminId
    );

    expect(mockFindOrderByIdRepository.findOrder).toHaveBeenCalledWith(
      mockOrderId
    );

    expect(mockUpdateUserOrderRepository.updateOrder).toHaveBeenCalledTimes(1);
    const updatedOrder =
      mockUpdateUserOrderRepository.updateOrder.mock.calls[0]![0];
    expect(updatedOrder.status).toBe(mockNewStatus);
  });

  it("deve lançar UserNotFoundError se o usuário solicitante não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    const mockRequest = {
      userId: "admin-id-123",
      id: "order-id-999",
      newStatus: "APPROVED" as orderStatus,
    };

    await expect(
      updateUserOrderStatusUseCase.execute(mockRequest)
    ).rejects.toThrow(UserNotFoundError);
    expect(mockFindOrderByIdRepository.findOrder).not.toHaveBeenCalled();
  });

  it("deve lançar UserAccessDeniedUpdateError se o usuário não for ADMIN", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockRegularUser as User
    );
    const mockRequest = {
      userId: "admin-id-123",
      id: "order-id-999",
      newStatus: "APPROVED" as orderStatus,
    };

    await expect(
      updateUserOrderStatusUseCase.execute(mockRequest)
    ).rejects.toThrow(UserAccessDeniedUpdateError);
    expect(mockFindOrderByIdRepository.findOrder).not.toHaveBeenCalled();
  });

  it("deve lançar UserOrderNotFoundError se a ordem não for encontrada", async () => {
    mockFindOrderByIdRepository.findOrder.mockResolvedValue(null);
    const mockRequest = {
      userId: "admin-id-123",
      id: "order-id-999",
      newStatus: "APPROVED" as orderStatus,
    };

    await expect(
      updateUserOrderStatusUseCase.execute(mockRequest)
    ).rejects.toThrow(UserOrderNotFoundError);
    expect(mockUpdateUserOrderRepository.updateOrder).not.toHaveBeenCalled();
  });

  it("deve lançar OrderErrorUpdated se o status já for APPROVED", async () => {
    mockFindOrderByIdRepository.findOrder.mockResolvedValue(
      mockOrderApproved as Order
    );
    const mockRequest = {
      userId: "admin-id-123",
      id: "order-id-999",
      newStatus: "APPROVED" as orderStatus,
    };

    await expect(
      updateUserOrderStatusUseCase.execute(mockRequest)
    ).rejects.toThrow(OrderErrorUpdated);
    expect(mockUpdateUserOrderRepository.updateOrder).not.toHaveBeenCalled();
  });

  it("deve lançar OrderErrorUpdated se o status já for DENIED", async () => {
    mockFindOrderByIdRepository.findOrder.mockResolvedValue(
      mockOrderDenied as Order
    );
    const mockRequest = {
      userId: "admin-id-123",
      id: "order-id-999",
      newStatus: "APPROVED" as orderStatus,
    };

    await expect(
      updateUserOrderStatusUseCase.execute(mockRequest)
    ).rejects.toThrow(OrderErrorUpdated);
    expect(mockUpdateUserOrderRepository.updateOrder).not.toHaveBeenCalled();
  });
});
