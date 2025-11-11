import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateOwnerSoccerUseCase } from "../../../../src/application/usecases/soccer/create/CreateOwnerSoccerUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { SoccerFoundError } from "../../../../src/shared/errors/soccer-error/SoccerFoundError";
import { UserOrderNotFoundError } from "../../../../src/shared/errors/user-error/UserOrderError";
import { User } from "../../../../src/domain/entities/User";
import { Soccer } from "../../../../src/domain/entities/Soccer";
import { UserAccessDeniedSoccerError } from "../../../../src/shared/errors/user-error/UserAccessDeniedError";
import { SoccerCnpjError } from "../../../../src/shared/errors/soccer-error/SoccerCnpjError";

const mockOwnerId = "owner-id-123";
const mockOwnerName = "Owner Name";
const mockOwnerCnpj = "12.345.678/0001-90";
const mockNewCep = "99999-999";
const mockNewLatitude = -20.0;
const mockNewLongitude = -40.0;
const mockNewPixKey = "pix@owner.com";

const mockRequestData = {
  userId: mockOwnerId,
  name: "New Court Name",
  description: "Test description.",
  cep: mockNewCep,
  address: "Av. Teste",
  city: "City Test",
  state: "SP",
  operationDays: ["SEG", "TER"],
  openHour: "08:00",
  closingHour: "22:00",
  priceHour: 50.0,
  maxDuration: 2,
  ownerPixKey: mockNewPixKey,
  observations: "None",
};

const mockOwnerUser = { id: mockOwnerId, role: "OWNER", name: mockOwnerName };

const mockApprovedOrder = {
  cnpj: mockOwnerCnpj,
  fone: "11999999999",
  status: "APPROVED",
};

const mockFindUserByIdRepository = { findUserById: vi.fn() };
const mockFindCepSoccerRepository = { findCepSoccer: vi.fn() };
const mockFindUserOrderRepository = { findUserOrder: vi.fn() };
const mockFindCnpjOwnerSoccerRepository = { findCnpjOwner: vi.fn() };
const mockOpenCageProvider = { getCoordinates: vi.fn() };
const mockPictureConfig = {
  logoMain: "logo.png",
  profileImageDefault: "default.png",
  soccerDefault: ["soccer_default.png"],
};
const mockCreateOwnerSoccerRepository = { createSoccer: vi.fn() };

let createOwnerSoccerUseCase: CreateOwnerSoccerUseCase;

describe("CreateOwnerSoccerUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockOwnerUser as User
    );
    mockFindCepSoccerRepository.findCepSoccer.mockResolvedValue(null);
    mockFindUserOrderRepository.findUserOrder.mockResolvedValue(
      mockApprovedOrder
    );
    mockFindCnpjOwnerSoccerRepository.findCnpjOwner.mockResolvedValue([]);
    mockOpenCageProvider.getCoordinates.mockResolvedValue({
      latitude: mockNewLatitude,
      longitude: mockNewLongitude,
    });
    mockCreateOwnerSoccerRepository.createSoccer.mockImplementation((soccer) =>
      Promise.resolve(soccer as Soccer)
    );

    createOwnerSoccerUseCase = new CreateOwnerSoccerUseCase(
      mockFindUserByIdRepository,
      mockFindCepSoccerRepository,
      mockFindUserOrderRepository,
      mockFindCnpjOwnerSoccerRepository,
      mockOpenCageProvider,
      mockPictureConfig,
      mockCreateOwnerSoccerRepository
    );
  });

  it("deve criar a quadra com sucesso, buscar coordenadas e usar dados da Order Aprovada", async () => {
    const result = await createOwnerSoccerUseCase.execute(mockRequestData);

    expect(mockOpenCageProvider.getCoordinates).toHaveBeenCalledWith(
      mockNewCep
    );

    expect(
      mockFindCnpjOwnerSoccerRepository.findCnpjOwner
    ).toHaveBeenCalledWith(mockApprovedOrder.cnpj);

    expect(mockCreateOwnerSoccerRepository.createSoccer).toHaveBeenCalledTimes(
      1
    );

    expect(result.cnpj).toBe(mockApprovedOrder.cnpj);
    expect(result.latitude).toBe(mockNewLatitude);
    expect(result.isActive).toBe(true);
  });

  it("deve lançar UserNotFoundError se o usuário solicitante não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    await expect(
      createOwnerSoccerUseCase.execute(mockRequestData)
    ).rejects.toThrow(UserNotFoundError);
    expect(mockFindCepSoccerRepository.findCepSoccer).not.toHaveBeenCalled();
  });

  it("deve lançar UserAccessDeniedSoccerError se o usuário for role USER", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue({
      ...mockOwnerUser,
      role: "USER",
    } as User);
    await expect(
      createOwnerSoccerUseCase.execute(mockRequestData)
    ).rejects.toThrow(UserAccessDeniedSoccerError);
  });

  it("deve lançar SoccerFoundError se uma quadra já existir com o mesmo CEP", async () => {
    mockFindCepSoccerRepository.findCepSoccer.mockResolvedValue({
      id: "existing-court",
    });
    await expect(
      createOwnerSoccerUseCase.execute(mockRequestData)
    ).rejects.toThrow(SoccerFoundError);
    expect(mockFindUserOrderRepository.findUserOrder).not.toHaveBeenCalled();
  });

  it("deve lançar UserOrderNotFoundError se o usuário não tiver uma Order (solicitação)", async () => {
    mockFindUserOrderRepository.findUserOrder.mockResolvedValue(null);
    await expect(
      createOwnerSoccerUseCase.execute(mockRequestData)
    ).rejects.toThrow(UserOrderNotFoundError);
  });

  it("deve lançar UserAccessDeniedSoccerError se a Order não estiver APROVADA", async () => {
    mockFindUserOrderRepository.findUserOrder.mockResolvedValue({
      ...mockApprovedOrder,
      status: "PENDING",
    });
    await expect(
      createOwnerSoccerUseCase.execute(mockRequestData)
    ).rejects.toThrow(UserAccessDeniedSoccerError);
  });

  it("deve lançar SoccerCnpjError se já houver uma quadra com o mesmo CNPJ", async () => {
    mockFindCnpjOwnerSoccerRepository.findCnpjOwner.mockResolvedValue([
      { id: "existing-cnpj-court" },
    ]);
    await expect(
      createOwnerSoccerUseCase.execute(mockRequestData)
    ).rejects.toThrow(SoccerCnpjError);
    expect(mockOpenCageProvider.getCoordinates).not.toHaveBeenCalled();
  });
});
