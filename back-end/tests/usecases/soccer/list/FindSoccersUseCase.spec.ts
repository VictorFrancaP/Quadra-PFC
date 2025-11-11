import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindSoccersUseCase } from "../../../../src/application/usecases/soccer/list/FindSoccersUseCase";
import { SoccersNotFoundError } from "../../../../src/shared/errors/soccer-error/SoccersNotFoundError";
import { Soccer } from "../../../../src/domain/entities/Soccer";

const encryptedCnpj = "ENCRYPTED_CNPJ_1";
const decryptedCnpj = "11.111.111/0001-11";
const encryptedFone = "ENCRYPTED_FONE_1";
const decryptedFone = "(11) 98888-8888";
const mockSoccerData = {
  id: "soccer-id-1",
  name: "Quadra A",
  cnpj: encryptedCnpj,
  fone: encryptedFone,
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
  userId: "owner-id",
  userName: "Owner Name",
  images: ["img.jpg"],
  latitude: -23,
  longitude: -46,
  ownerPixKey: "pixkey",
  observations: "obs",
};

const mockSoccersList: Soccer[] = [
  mockSoccerData as Soccer,
  {
    ...mockSoccerData,
    id: "soccer-id-2",
    name: "Quadra B",
    cnpj: "ENC_CNPJ_2",
    fone: "ENC_FONE_2",
  } as Soccer,
];
const mockFindSoccersRepository = { findSoccers: vi.fn() };
const mockDecryptData = { decrypted: vi.fn() };

let findSoccersUseCase: FindSoccersUseCase;

describe("FindSoccersUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindSoccersRepository.findSoccers.mockResolvedValue(mockSoccersList);
    mockDecryptData.decrypted.mockImplementation((encryptedValue) => {
      if (encryptedValue === encryptedCnpj)
        return Promise.resolve(decryptedCnpj);
      if (encryptedValue === encryptedFone)
        return Promise.resolve(decryptedFone);
      if (encryptedValue === "ENC_CNPJ_2")
        return Promise.resolve("22.222.222/0002-22");
      if (encryptedValue === "ENC_FONE_2")
        return Promise.resolve("(22) 97777-7777");
      return Promise.resolve(encryptedValue);
    });

    findSoccersUseCase = new FindSoccersUseCase(
      mockFindSoccersRepository,
      mockDecryptData
    );
  });

  it("deve buscar todas as quadras e descriptografar CNPJ e Fone em paralelo", async () => {
    await expect(findSoccersUseCase.execute()).resolves.toHaveLength(2);
    expect(mockFindSoccersRepository.findSoccers).toHaveBeenCalledTimes(1);
    expect(mockDecryptData.decrypted).toHaveBeenCalledTimes(4);
    expect(mockDecryptData.decrypted).toHaveBeenCalledWith(encryptedCnpj);
    expect(mockDecryptData.decrypted).toHaveBeenCalledWith(encryptedFone);
  });

  it("deve retornar a lista de entidades Soccer com os dados limpos", async () => {
    const result = await findSoccersUseCase.execute();
    const firstSoccer = result.find((s) => s.id === "soccer-id-1");

    expect(firstSoccer).toBeDefined();
    expect(firstSoccer!.cnpj).toBe(decryptedCnpj);
    expect(firstSoccer!.fone).toBe(decryptedFone);
    expect(firstSoccer!.name).toBe("Quadra A");
  });

  it("deve lançar SoccersNotFoundError se nenhuma quadra for encontrada (lista vazia)", async () => {
    mockFindSoccersRepository.findSoccers.mockResolvedValue([]);

    await expect(findSoccersUseCase.execute()).rejects.toThrow(
      SoccersNotFoundError
    );

    expect(mockDecryptData.decrypted).not.toHaveBeenCalled();
  });

  it("deve lançar SoccersNotFoundError se o retorno for null", async () => {
    mockFindSoccersRepository.findSoccers.mockResolvedValue(null);

    await expect(findSoccersUseCase.execute()).rejects.toThrow(
      SoccersNotFoundError
    );

    expect(mockDecryptData.decrypted).not.toHaveBeenCalled();
  });
});
