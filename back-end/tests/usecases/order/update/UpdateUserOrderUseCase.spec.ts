import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateUserOrderUseCase } from "../../../../src/application/usecases/order/update/UpdateUserOrderUseCase";
import {
  UserOrderNotFoundError,
  UserUpdatedLimitedOrderError,
} from "../../../../src/shared/errors/user-error/UserOrderError";

const mockUserId = "user-updating-id";
const mockOrderId = "order-to-update-id";
const mockNewLocalName = "New Local Name";
const mockNewFone = "(11) 99999-0000";
const mockEncryptedLocalName = "ENC_NEW_LOCAL";
const mockEncryptedFone = "ENC_NEW_FONE";
const mockUpdateUserOrderFunction = vi.fn((order, updates) => ({
  ...order,
  ...updates,
}));
const createCompleteOrderMock = (id: string) => {
  const mockProcedure = vi.fn();

  return {
    id: id,
    userId: "user-updating-id",
    localName: "Old Local",
    description: "Old Description",
    fone: "Old Fone",
    cnpj: "11122233344400",
    status: "PENDING",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    updateUserOrder: mockUpdateUserOrderFunction,
    capture: mockProcedure,
    cancel: mockProcedure,
    refund: mockProcedure,
    create: mockProcedure,
    get: mockProcedure,
    process: mockProcedure,
  };
};
const mockOrderBase = createCompleteOrderMock(mockOrderId);

const mockRequestData = {
  userId: mockUserId,
  localName: mockNewLocalName,
  description: "New Description",
  fone: mockNewFone,
};

const mockFindUserOrderRepository = { findUserOrder: vi.fn() };
const mockRedisProvider = {
  dataGet: vi.fn(),
  dataSet: vi.fn(),
  dataDelete: vi.fn(),
};
const mockEncryptData = { encrypted: vi.fn(), decrypted: vi.fn() };
const mockUpdateUserOrderRepository = { updateOrder: vi.fn() };
let updateUserOrderUseCase: UpdateUserOrderUseCase;

describe("UpdateUserOrderUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserOrderRepository.findUserOrder.mockResolvedValue(mockOrderBase);
    mockRedisProvider.dataGet.mockResolvedValue(null);

    mockEncryptData.encrypted.mockImplementation((data) => {
      if (data === mockNewLocalName)
        return Promise.resolve(mockEncryptedLocalName);
      if (data === mockNewFone) return Promise.resolve(mockEncryptedFone);
      return Promise.resolve(`ENC_${data}`);
    });

    updateUserOrderUseCase = new UpdateUserOrderUseCase(
      mockFindUserOrderRepository,
      mockRedisProvider,
      mockEncryptData as any,
      mockUpdateUserOrderRepository
    );
  });

  it("deve criptografar os dados alterados, aplicar o rate limit e atualizar o DB", async () => {
    const mockRequest = {
      userId: mockUserId,
      localName: mockNewLocalName,
      fone: mockNewFone,
      description: mockRequestData.description,
    };

    await expect(
      updateUserOrderUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(mockRedisProvider.dataGet).toHaveBeenCalledTimes(1);

    expect(mockEncryptData.encrypted).toHaveBeenCalledTimes(3);

    expect(mockRedisProvider.dataSet).toHaveBeenCalledWith(
      expect.objectContaining({
        key: `pendind_user_update_limited:${mockUserId}`,
        expiration: 300,
      })
    );
    const updatedOrder =
      mockUpdateUserOrderRepository.updateOrder.mock.calls[0]![0];
    expect(updatedOrder.localName).toBe(mockEncryptedLocalName);
    expect(updatedOrder.fone).toBe(mockEncryptedFone);
    expect(mockUpdateUserOrderRepository.updateOrder).toHaveBeenCalledTimes(1);
  });

  it("deve lançar UserOrderNotFoundError se a solicitação não for encontrada", async () => {
    mockFindUserOrderRepository.findUserOrder.mockResolvedValue(null);
    await expect(
      updateUserOrderUseCase.execute(mockRequestData)
    ).rejects.toThrow(UserOrderNotFoundError);
    expect(mockRedisProvider.dataGet).not.toHaveBeenCalled();
  });

  it("deve lançar UserUpdatedLimitedOrderError se o rate limit for atingido (5 minutos)", async () => {
    mockRedisProvider.dataGet.mockResolvedValue("true");

    await expect(
      updateUserOrderUseCase.execute(mockRequestData)
    ).rejects.toThrow(UserUpdatedLimitedOrderError);
    expect(mockEncryptData.encrypted).not.toHaveBeenCalled();
    expect(mockUpdateUserOrderRepository.updateOrder).not.toHaveBeenCalled();
  });

  it("deve retornar sem fazer update se nenhum campo for fornecido (Object.keys(updates).length === 0)", async () => {
    const mockEmptyRequest = {
      userId: mockUserId,
      localName: undefined,
      description: undefined,
      fone: undefined,
    };

    await expect(
      updateUserOrderUseCase.execute(mockEmptyRequest)
    ).resolves.toBeUndefined();

    expect(mockRedisProvider.dataGet).toHaveBeenCalledTimes(1);
    expect(mockUpdateUserOrderRepository.updateOrder).not.toHaveBeenCalled();
  });
});
