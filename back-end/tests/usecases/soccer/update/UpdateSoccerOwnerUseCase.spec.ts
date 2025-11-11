import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateSoccerOwnerUseCase } from "../../../../src/application/usecases/soccer/update/UpdateSoccerOwnerUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { SoccerAccessDeniedUpdateError } from "../../../../src/shared/errors/soccer-error/SoccerAccessDeniedError";
import { SoccerNotFoundError } from "../../../../src/shared/errors/soccer-error/SoccerNotFoundError";
import { User } from "../../../../src/domain/entities/User";
import { Soccer } from "../../../../src/domain/entities/Soccer";

const mockOwnerId = "owner-id-123";
const mockUserId = "regular-user-id-456";
const mockOldCep = "10000-000";
const mockNewCep = "90000-000";
const mockNewFone = "(11) 98888-7777";
const mockEncryptedFone = "encrypted-new-fone-data";
const mockNewLat = -25.0;
const mockNewLng = -47.0;
const mockOwnerUser = { id: mockOwnerId, role: "OWNER" };
const mockRegularUser = { id: mockUserId, role: "USER" };

const mockExistingSoccer = {
  id: "soccer-id-999",
  userId: mockOwnerId,
  cep: mockOldCep,
  fone: "old-encrypted-fone",
  latitude: -23.0,
  longitude: -45.0,
  name: "Old Name",
  description: "Desc",
  address: "Old Address",
  city: "City",
  state: "SP",
  operationDays: ["SEG"],
  openHour: "08:00",
  closingHour: "22:00",
  priceHour: 50.0,
  maxDuration: 2,
  isActive: true,
  userName: "Owner Name",
  images: ["img.jpg"],
  ownerPixKey: "pixkey",
  observations: "obs",
};

const mockUpdateData = {
  userId: mockOwnerId,
  soccerId: "soccer-id-999",
  name: "New Court Name",
  description: "New Description",
  cep: mockNewCep,
  address: "New Address",
  city: "New City",
  state: "SP",
  fone: mockNewFone,
  operationDays: ["SEG", "TER"],
  openHour: "07:00",
  closingHour: "23:00",
  priceHour: 60.0,
  maxDuration: 3,
  images: ["img1.jpg", "img2.jpg"],
  isActive: true,
  observations: "Updated obs",
};

const mockFindUserByIdRepository = { findUserById: vi.fn() };
const mockFindSoccerOwnerRepository = { findSoccerOwner: vi.fn() };
const mockOpenCageProvider = {
  getCoordinates: vi.fn(),
  decrypted: vi.fn(),
  encrypted: vi.fn(),
};
const mockEncryptData = { encrypted: vi.fn(), decrypted: vi.fn() };
const mockUpdateSoccerOwnerRepository = { updateSoccer: vi.fn() };
let updateSoccerOwnerUseCase: UpdateSoccerOwnerUseCase;

describe("UpdateSoccerOwnerUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockOwnerUser as User
    );
    mockFindSoccerOwnerRepository.findSoccerOwner.mockResolvedValue(
      mockExistingSoccer as Soccer
    );
    mockEncryptData.encrypted.mockResolvedValue(mockEncryptedFone);
    mockOpenCageProvider.getCoordinates.mockResolvedValue({
      latitude: mockNewLat,
      longitude: mockNewLng,
    });
    mockUpdateSoccerOwnerRepository.updateSoccer.mockResolvedValue(undefined);

    updateSoccerOwnerUseCase = new UpdateSoccerOwnerUseCase(
      mockFindUserByIdRepository,
      mockFindSoccerOwnerRepository,
      mockOpenCageProvider,
      mockEncryptData,
      mockUpdateSoccerOwnerRepository
    );
  });

  it("deve atualizar todos os campos, criptografar o telefone e gerar novas coordenadas", async () => {
    const mockRequest = { ...mockUpdateData, cep: mockNewCep };

    await expect(
      updateSoccerOwnerUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(mockOpenCageProvider.getCoordinates).toHaveBeenCalledWith(
      mockNewCep
    );

    expect(mockEncryptData.encrypted).toHaveBeenCalledWith(mockNewFone);

    expect(mockUpdateSoccerOwnerRepository.updateSoccer).toHaveBeenCalledTimes(
      1
    );

    const updatedSoccer = mockUpdateSoccerOwnerRepository.updateSoccer.mock
      .calls[0]![0] as Soccer;
    expect(updatedSoccer.name).toBe(mockRequest.name);
    expect(updatedSoccer.fone).toBe(mockEncryptedFone);
    expect(updatedSoccer.latitude).toBe(mockNewLat);
    expect(updatedSoccer.cep).toBe(mockNewCep);
  });

  it("deve atualizar o telefone e manter as coordenadas se o CEP não for alterado", async () => {
    const mockRequest = { ...mockUpdateData, cep: mockOldCep };

    await expect(
      updateSoccerOwnerUseCase.execute(mockRequest)
    ).resolves.toBeUndefined();

    expect(mockOpenCageProvider.getCoordinates).not.toHaveBeenCalled();

    const updatedSoccer = mockUpdateSoccerOwnerRepository.updateSoccer.mock
      .calls[0]![0] as Soccer;
    expect(updatedSoccer.latitude).toBe(mockExistingSoccer.latitude);
    expect(updatedSoccer.fone).toBe(mockEncryptedFone);
  });

  it("deve lançar UserNotFoundError se o usuário solicitante não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    const mockRequest = { ...mockUpdateData, userId: "invalid-user" };

    await expect(updateSoccerOwnerUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );
    expect(
      mockFindSoccerOwnerRepository.findSoccerOwner
    ).not.toHaveBeenCalled();
  });

  it("deve lançar SoccerAccessDeniedUpdateError se o usuário não for OWNER", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockRegularUser as User
    );
    const mockRequest = { ...mockUpdateData, userId: mockUserId };

    await expect(updateSoccerOwnerUseCase.execute(mockRequest)).rejects.toThrow(
      SoccerAccessDeniedUpdateError
    );
    expect(
      mockFindSoccerOwnerRepository.findSoccerOwner
    ).not.toHaveBeenCalled();
  });

  it("deve lançar SoccerNotFoundError se o proprietário não tiver quadra cadastrada", async () => {
    mockFindSoccerOwnerRepository.findSoccerOwner.mockResolvedValue(null);
    const mockRequest = { ...mockUpdateData };

    await expect(updateSoccerOwnerUseCase.execute(mockRequest)).rejects.toThrow(
      SoccerNotFoundError
    );
    expect(mockEncryptData.encrypted).not.toHaveBeenCalled();
  });
});
