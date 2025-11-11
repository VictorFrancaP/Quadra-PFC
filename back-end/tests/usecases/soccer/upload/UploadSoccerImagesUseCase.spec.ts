import { describe, it, expect, vi, beforeEach } from "vitest";
import { UploadSoccerImagesUseCase } from "../../../../src/application/usecases/soccer/images-soccer/UploadSoccerImagesUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../../src/shared/errors/soccer-error/SoccerNotFoundError";
import { UserAccessDeniedSoccerError } from "../../../../src/shared/errors/user-error/UserAccessDeniedError";
import { SoccerImagesError } from "../../../../src/shared/errors/soccer-error/SoccerImagesError";
import { User } from "../../../../src/domain/entities/User";
import { Soccer } from "../../../../src/domain/entities/Soccer";
import { SoccerAccessDeniedUpdateError } from "../../../../src/shared/errors/soccer-error/SoccerAccessDeniedError";
import { SoccerImagesLimitedError } from "../../../../src/shared/errors/soccer-error/SoccerImagesLimitedError";

const mockOwnerId = "owner-id-123";
const mockUserId = "user-id-456";
const mockSoccerId = "soccer-to-update-id";
const mockNewImages = ["url/new1.jpg", "url/new2.jpg"];
const mockExistingImages = ["url/old1.jpg", "url/old2.jpg"];

const mockOwnerUser = { id: mockOwnerId, role: "OWNER" };
const mockRegularUser = { id: mockUserId, role: "USER" };

const mockSoccerBase = {
  id: mockSoccerId,
  userId: mockOwnerId,
  images: mockExistingImages,
};

const mockFindUserByIdRepository = { findUserById: vi.fn() };
const mockFindSoccerByIdRepository = { findSoccerById: vi.fn() };
const mockUpdateSoccerOwnerRepository = { updateSoccer: vi.fn() };

let uploadSoccerImagesUseCase: UploadSoccerImagesUseCase;

describe("UploadSoccerImagesUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockOwnerUser as User
    );
    mockFindSoccerByIdRepository.findSoccerById.mockResolvedValue(
      mockSoccerBase as Soccer
    );

    uploadSoccerImagesUseCase = new UploadSoccerImagesUseCase(
      mockFindUserByIdRepository,
      mockFindSoccerByIdRepository,
      mockUpdateSoccerOwnerRepository
    );
  });

  it("deve adicionar novas imagens à lista existente e retornar a lista completa", async () => {
    const mockRequest = {
      userId: mockOwnerId,
      soccerId: mockSoccerId,
      images: mockNewImages,
    };
    const expectedLength = mockExistingImages.length + mockNewImages.length; // 4

    const result = await uploadSoccerImagesUseCase.execute(mockRequest);

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledTimes(1);
    expect(mockFindSoccerByIdRepository.findSoccerById).toHaveBeenCalledTimes(
      1
    );
    expect(mockUpdateSoccerOwnerRepository.updateSoccer).toHaveBeenCalledTimes(
      1
    );
    const updatedSoccer =
      mockUpdateSoccerOwnerRepository.updateSoccer.mock.calls[0]![0];
    expect(updatedSoccer.images).toHaveLength(expectedLength);
    expect(updatedSoccer.images).toContain(mockNewImages[0]);
    expect(updatedSoccer.images).toContain(mockExistingImages[0]);

    expect(result.updatedImages).toHaveLength(expectedLength);
  });

  it("deve lançar UserNotFoundError se o usuário solicitante não for encontrado", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    const mockRequest = {
      userId: "non-existent",
      soccerId: mockSoccerId,
      images: mockNewImages,
    };

    await expect(
      uploadSoccerImagesUseCase.execute(mockRequest)
    ).rejects.toThrow(UserNotFoundError);
  });

  it("deve lançar SoccerNotFoundError se a quadra não for encontrada", async () => {
    mockFindSoccerByIdRepository.findSoccerById.mockResolvedValue(null);
    const mockRequest = {
      userId: mockOwnerId,
      soccerId: "invalid-id",
      images: mockNewImages,
    };

    await expect(
      uploadSoccerImagesUseCase.execute(mockRequest)
    ).rejects.toThrow(SoccerNotFoundError);
  });

  it("deve lançar UserAccessDeniedSoccerError se o usuário for role USER", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(
      mockRegularUser as User
    );
    const mockRequest = {
      userId: mockUserId,
      soccerId: mockSoccerId,
      images: mockNewImages,
    };

    await expect(
      uploadSoccerImagesUseCase.execute(mockRequest)
    ).rejects.toThrow(UserAccessDeniedSoccerError);
  });

  it("deve lançar SoccerAccessDeniedUpdateError se o usuário não for o dono da quadra", async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue({
      id: mockUserId,
      role: "OWNER",
    } as User);

    mockFindSoccerByIdRepository.findSoccerById.mockResolvedValue({
      ...mockSoccerBase,
      userId: mockOwnerId,
    } as Soccer);

    const mockRequest = {
      userId: mockUserId,
      soccerId: mockSoccerId,
      images: mockNewImages,
    };

    await expect(
      uploadSoccerImagesUseCase.execute(mockRequest)
    ).rejects.toThrow(SoccerAccessDeniedUpdateError);
  });

  it("deve lançar SoccerImagesError se a lista de imagens enviada for nula ou vazia", async () => {
    const mockRequestNull = {
      userId: mockOwnerId,
      soccerId: mockSoccerId,
      images: null,
    };
    const mockRequestEmpty = {
      userId: mockOwnerId,
      soccerId: mockSoccerId,
      images: [],
    };

    await expect(
      uploadSoccerImagesUseCase.execute(mockRequestNull)
    ).rejects.toThrow(SoccerImagesError);
    await expect(
      uploadSoccerImagesUseCase.execute(mockRequestEmpty)
    ).rejects.toThrow(SoccerImagesError);
  });

  it("deve lançar SoccerImagesLimitedError se exceder 10 imagens no total", async () => {
    const nineExistingImages = Array(9).fill("url/existing");
    mockFindSoccerByIdRepository.findSoccerById.mockResolvedValue({
      ...mockSoccerBase,
      images: nineExistingImages,
    } as Soccer);

    const mockRequest = {
      userId: mockOwnerId,
      soccerId: mockSoccerId,
      images: ["new1", "new2"],
    };

    await expect(
      uploadSoccerImagesUseCase.execute(mockRequest)
    ).rejects.toThrow(SoccerImagesLimitedError);

    expect(mockUpdateSoccerOwnerRepository.updateSoccer).not.toHaveBeenCalled();
  });
});
