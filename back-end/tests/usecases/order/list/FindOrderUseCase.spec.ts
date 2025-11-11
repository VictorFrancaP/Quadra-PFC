import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindOrderUseCase } from "../../../../src/application/usecases/order/list/FindOrderUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { UserOrderNotFoundError } from "../../../../src/shared/errors/user-error/UserOrderError";
import { User } from "../../../../src/domain/entities/User";
import { Order } from "../../../../src/domain/entities/Order";

const mockUserId = "user-to-find-order-id";
const encryptedLocalName = "ENC_LOCAL_NAME";
const decryptedLocalName = "Meu Local Teste";
const encryptedDescription = "ENC_DESC";
const decryptedDescription = "Descrição Completa";
const encryptedCnpj = "ENC_CNPJ_DATA";
const decryptedCnpj = "11.111.111/0001-11";
const encryptedFone = "ENC_FONE_DATA";
const decryptedFone = "(11) 99999-9999";
const mockUser = { id: mockUserId, role: "USER" };

const mockOrderData = {
  id: "order-id-1",
  userId: mockUserId,
  localName: encryptedLocalName,
  description: encryptedDescription,
  cnpj: encryptedCnpj,
  fone: encryptedFone,
  status: "PENDING",
};

const mockFindUserByIdRepository = { findUserById: vi.fn() };
const mockFindUserOrderRepository = { findUserOrder: vi.fn() };
const mockDecryptData = { decrypted: vi.fn(), encrypted: vi.fn() };

let findOrderUseCase: FindOrderUseCase;

describe("FindOrderUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue(mockUser as User);
    mockFindUserOrderRepository.findUserOrder.mockResolvedValue(
      mockOrderData as Order
    );

    mockDecryptData.decrypted.mockImplementation((encryptedValue) => {
      if (encryptedValue === encryptedLocalName)
        return Promise.resolve(decryptedLocalName);
      if (encryptedValue === encryptedDescription)
        return Promise.resolve(decryptedDescription);
      if (encryptedValue === encryptedCnpj)
        return Promise.resolve(decryptedCnpj);
      if (encryptedValue === encryptedFone)
        return Promise.resolve(decryptedFone);
      return Promise.resolve(encryptedValue);
    });

    findOrderUseCase = new FindOrderUseCase(
      mockFindUserByIdRepository,
      mockFindUserOrderRepository,
      mockDecryptData as any
    );
  });

  it("deve buscar o pedido e retornar todos os dados com campos sensíveis descriptografados", async () => {
    const mockRequest = { userId: mockUserId };

    const result = await findOrderUseCase.execute(mockRequest);

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(
      mockUserId
    );

    expect(mockFindUserOrderRepository.findUserOrder).toHaveBeenCalledWith(
      mockUserId
    );

    expect(mockDecryptData.decrypted).toHaveBeenCalledTimes(4);
    expect(mockDecryptData.decrypted).toHaveBeenCalledWith(encryptedCnpj);

    expect(result.localName).toBe(decryptedLocalName);
    expect(result.cnpj).toBe(decryptedCnpj);
    expect(result.status).toBe("PENDING");
  });

  it("deve lançar UserNotFoundError se o usuário solicitante não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    const mockRequest = { userId: "invalid-user" };

    await expect(findOrderUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );
    expect(mockFindUserOrderRepository.findUserOrder).not.toHaveBeenCalled();
  });

  it("deve lançar UserOrderNotFoundError se o usuário não tiver uma solicitação de Order", async () => {
    mockFindUserOrderRepository.findUserOrder.mockResolvedValue(null);
    const mockRequest = { userId: mockUserId };

    await expect(findOrderUseCase.execute(mockRequest)).rejects.toThrow(
      UserOrderNotFoundError
    );
    expect(mockDecryptData.decrypted).not.toHaveBeenCalled();
  });
});
