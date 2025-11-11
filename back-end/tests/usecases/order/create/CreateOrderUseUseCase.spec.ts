import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateOrderUserUseCase } from "../../../../src/application/usecases/order/create/CreateOrderUserUseCase";
import {
  UserOrderCnpjError,
  UserOrderError,
} from "../../../../src/shared/errors/user-error/UserOrderError";
import { Order } from "../../../../src/domain/entities/Order";

const mockUserId = "user-requesting-id";
const mockCnpj = "11.111.111/0001-11";
const mockFone = "(11) 99999-9999";
const mockLocalName = "Meu Local Teste";
const mockDescription = "Descrição breve";
const encryptedCnpj = "ENCRYPTED_CNPJ_DATA";
const encryptedFone = "ENCRYPTED_FONE_DATA";
const encryptedLocalName = "ENCRYPTED_LOCAL_NAME";
const encryptedDescription = "ENCRYPTED_DESCRIPTION";
const mockRequestData = {
  userId: mockUserId,
  localName: mockLocalName,
  description: mockDescription,
  cnpj: mockCnpj,
  fone: mockFone,
};

const mockFindUserCnpjOrderRepository = { findUserCnpj: vi.fn() };
const mockFindUserOrderRepository = { findUserOrder: vi.fn() };
const mockEncryptData = { encrypted: vi.fn(), decrypted: vi.fn() };
const mockCreateOrderRepository = { createOrder: vi.fn() };

let createOrderUserUseCase: CreateOrderUserUseCase;

describe("CreateOrderUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserCnpjOrderRepository.findUserCnpj.mockResolvedValue(null);
    mockFindUserOrderRepository.findUserOrder.mockResolvedValue(null);

    mockEncryptData.encrypted.mockImplementation((data) => {
      if (data === mockCnpj) return Promise.resolve(encryptedCnpj);
      if (data === mockFone) return Promise.resolve(encryptedFone);
      if (data === mockLocalName) return Promise.resolve(encryptedLocalName);
      if (data === mockDescription)
        return Promise.resolve(encryptedDescription);
      return Promise.resolve("unknown-encrypted");
    });
    const mockCreatedOrder = { id: "order-id", ...mockRequestData };
    mockCreateOrderRepository.createOrder.mockResolvedValue(
      mockCreatedOrder as Order
    );

    createOrderUserUseCase = new CreateOrderUserUseCase(
      mockFindUserCnpjOrderRepository,
      mockFindUserOrderRepository,
      mockEncryptData as any,
      mockCreateOrderRepository
    );
  });

  it("deve criptografar dados sensíveis, criar e retornar o pedido de solicitação", async () => {
    const result = await createOrderUserUseCase.execute(mockRequestData);

    expect(mockFindUserCnpjOrderRepository.findUserCnpj).toHaveBeenCalledWith(
      mockCnpj
    );
    expect(mockFindUserOrderRepository.findUserOrder).toHaveBeenCalledWith(
      mockUserId
    );

    expect(mockEncryptData.encrypted).toHaveBeenCalledTimes(4);

    const createdOrderArgument = mockCreateOrderRepository.createOrder.mock
      .calls[0]![0] as Order;
    expect(createdOrderArgument.cnpj).toBe(encryptedCnpj);
    expect(createdOrderArgument.localName).toBe(encryptedLocalName);
    expect(createdOrderArgument.status).toBe("PENDING");

    expect(result.id).toBe("order-id");
  });

  it("deve lançar UserOrderCnpjError se o CNPJ já estiver sendo utilizado em outro pedido", async () => {
    mockFindUserCnpjOrderRepository.findUserCnpj.mockResolvedValue({
      id: "existing-order",
    });

    await expect(
      createOrderUserUseCase.execute(mockRequestData)
    ).rejects.toThrow(UserOrderCnpjError);

    expect(mockFindUserOrderRepository.findUserOrder).not.toHaveBeenCalled();
    expect(mockEncryptData.encrypted).not.toHaveBeenCalled();
  });

  it("deve lançar UserOrderError se o usuário já tiver um pedido de solicitação existente", async () => {
    mockFindUserOrderRepository.findUserOrder.mockResolvedValue({
      id: "existing-order",
    });

    await expect(
      createOrderUserUseCase.execute(mockRequestData)
    ).rejects.toThrow(UserOrderError);

    expect(mockEncryptData.encrypted).not.toHaveBeenCalled();
    expect(mockCreateOrderRepository.createOrder).not.toHaveBeenCalled();
  });
});
