import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetProfileImagesUserUseCase } from "../../../../src/application/usecases/user/profile/GetProfileImagesUserUseCase";

const mockImageUrls: string[] = [
  "http://cloudinary.com/image1.jpg",
  "http://cloudinary.com/image2.jpg",
  "http://cloudinary.com/image3.jpg",
];

const mockProfileImagesProvider = {
  getImages: vi.fn(),
  upload: vi.fn(),
  delete: vi.fn(),
};

let getProfileImagesUserUseCase: GetProfileImagesUserUseCase;

describe("GetProfileImagesUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockProfileImagesProvider.getImages.mockResolvedValue(mockImageUrls);

    getProfileImagesUserUseCase = new GetProfileImagesUserUseCase(
      mockProfileImagesProvider
    );
  });

  it("deve chamar o provedor de imagens e retornar a lista de URLs de perfil", async () => {
    const result = await getProfileImagesUserUseCase.execute();

    expect(mockProfileImagesProvider.getImages).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockImageUrls);
    expect(result.length).toBe(3);
  });

  it("deve retornar um array vazio se o provedor não encontrar imagens", async () => {
    mockProfileImagesProvider.getImages.mockResolvedValue([]);

    const result = await getProfileImagesUserUseCase.execute();

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});
