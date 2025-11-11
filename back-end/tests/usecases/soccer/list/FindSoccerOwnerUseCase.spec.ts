import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindSoccerOwnerUseCase } from "../../../../src/application/usecases/soccer/list/FindSoccerOwnerUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { SoccerAccessDeniedViewError } from "../../../../src/shared/errors/soccer-error/SoccerAccessDeniedError";
import { User } from "../../../../src/domain/entities/User";
import { Soccer } from "../../../../src/domain/entities/Soccer";
import { SoccerNotFoundError } from "../../../../src/shared/errors/soccer-error/SoccerNotFoundError";

const mockOwnerId = "owner-id-123";
const mockUserId = "regular-user-id-456";
const mockSoccerId = "soccer-id-789";
const encryptedCnpj = "encrypted-cnpj-data";
const decryptedCnpj = "12.345.678/0001-90";
const encryptedFone = "encrypted-fone-data";
const decryptedFone = "(11) 98765-4321";
const mockOwnerUser = { id: mockOwnerId, role: "OWNER", name: "Leonardo" };
const mockRegularUser = { id: mockUserId, role: "USER" };

const mockSoccerData = {
  id: mockSoccerId,
  userId: mockOwnerId,
  cnpj: encryptedCnpj,
  fone: encryptedFone,
  name: "Owner Court",
  description: "Desc",
  cep: "12345000",
  address: "Address",
  city: "City",
  state: "SP",
  operationDays: ["SEG"],
  openHour: "08:00",
  closingHour: "22:00",
  priceHour: 50.0,
  maxDuration: 2,
  isActive: true,
  userName: mockOwnerUser.name,
  images: ["img.jpg"],
  latitude: -23,
  longitude: -46,
  ownerPixKey: "pixkey",
  observations: "obs",
};

const mockFindUserByIdRepository = { findUserById: vi.fn() };
const mockFindSoccerOwnerRepository = { findSoccerOwner: vi.fn() };
const mockDecryptData = { decrypted: vi.fn() };

let findSoccerOwnerUseCase: FindSoccerOwnerUseCase;

describe("FindSoccerOwnerUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockOwnerUser as User
    );
    mockFindSoccerOwnerRepository.findSoccerOwner.mockResolvedValue(
      mockSoccerData as Soccer
    );

    mockDecryptData.decrypted.mockImplementation((encryptedValue) => {
      if (encryptedValue === encryptedCnpj)
        return Promise.resolve(decryptedCnpj);
      if (encryptedValue === encryptedFone)
        return Promise.resolve(decryptedFone);
      return Promise.resolve("unknown");
    });

    findSoccerOwnerUseCase = new FindSoccerOwnerUseCase(
      mockFindUserByIdRepository,
      mockFindSoccerOwnerRepository,
      mockDecryptData
    );
  });

  it("deve retornar a quadra do proprietário com CNPJ e Telefone descriptografados", async () => {
    const mockRequest = { userId: mockOwnerId };

    const result = await findSoccerOwnerUseCase.execute(mockRequest);

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(
      mockOwnerId
    );

    expect(mockFindSoccerOwnerRepository.findSoccerOwner).toHaveBeenCalledWith(
      mockOwnerId
    );

    expect(mockDecryptData.decrypted).toHaveBeenCalledTimes(2);
    expect(mockDecryptData.decrypted).toHaveBeenCalledWith(encryptedCnpj);
    expect(mockDecryptData.decrypted).toHaveBeenCalledWith(encryptedFone);

    expect(result.cnpj).toBe(decryptedCnpj);
    expect(result.fone).toBe(decryptedFone);
    expect(result.id).toBe(mockSoccerId);
  });

  it("deve lançar UserNotFoundError se o usuário logado não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    const mockRequest = { userId: "invalid-id" };

    await expect(findSoccerOwnerUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );
    expect(
      mockFindSoccerOwnerRepository.findSoccerOwner
    ).not.toHaveBeenCalled();
  });

  it("deve lançar SoccerAccessDeniedViewError se o usuário não for OWNER", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockRegularUser as User
    );
    const mockRequest = { userId: mockUserId };

    await expect(findSoccerOwnerUseCase.execute(mockRequest)).rejects.toThrow(
      SoccerAccessDeniedViewError
    );
    expect(
      mockFindSoccerOwnerRepository.findSoccerOwner
    ).not.toHaveBeenCalled();
  });

  it("deve lançar SoccerNotFoundError se o proprietário não tiver quadra cadastrada", async () => {
    mockFindSoccerOwnerRepository.findSoccerOwner.mockResolvedValue(null);
    const mockRequest = { userId: mockOwnerId };

    await expect(findSoccerOwnerUseCase.execute(mockRequest)).rejects.toThrow(
      SoccerNotFoundError
    );
    expect(mockDecryptData.decrypted).not.toHaveBeenCalled();
  });
});
