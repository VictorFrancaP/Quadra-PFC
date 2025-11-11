import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfileUserUseCase } from "../../../../src/application/usecases/user/list/ProfileUserUseCase";
import { UserNotFoundError } from "../../../../src/shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedError } from "../../../../src/shared/errors/user-error/UserAccessDeniedError";
import { IProfileRequest } from "../../../../src/domain/repositories/user/IProfileUserRepositories";

const mockUserId = "authenticated-user-id";
const mockAnotherUserId = "unauthorized-user-id";

const mockProfileData: IProfileRequest = {
  id: mockUserId,
  name: "Profile Viewer",
  email: "viewer@test.com",
  age: 30,
  address: "Rua de Teste, 10",
  cep: "00000-000",
  cpf: "111.222.333-44",
  gender: "NOTINFORM",
  profileImage: "default.png",
};

const mockProfileUserRepository = {
  viewProfile: vi.fn(),
};

let profileUserUseCase: ProfileUserUseCase;

describe("ProfileUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockProfileUserRepository.viewProfile.mockImplementation((id) => {
      if (id === mockUserId) {
        return Promise.resolve(mockProfileData);
      }
      return Promise.resolve({ ...mockProfileData, id: mockAnotherUserId });
    });

    profileUserUseCase = new ProfileUserUseCase(mockProfileUserRepository);
  });

  it("should return the user profile when the authenticated ID matches the requested ID", async () => {
    const mockRequest = { userId: mockUserId };

    mockProfileUserRepository.viewProfile.mockResolvedValue(mockProfileData);

    const result = await profileUserUseCase.execute(mockRequest);

    expect(mockProfileUserRepository.viewProfile).toHaveBeenCalledWith(
      mockUserId
    );

    expect(result).toEqual(mockProfileData);
  });

  it("should throw UserNotFoundError if the user is not found in the database", async () => {
    mockProfileUserRepository.viewProfile.mockResolvedValue(null);

    const mockRequest = { userId: mockUserId };

    await expect(profileUserUseCase.execute(mockRequest)).rejects.toThrow(
      UserNotFoundError
    );

    expect(mockProfileUserRepository.viewProfile).toHaveBeenCalledWith(
      mockUserId
    );
  });

  it("should throw UserAccessDeniedError if the retrieved user ID does not match the requested ID", async () => {
    const mockRequest = { userId: mockUserId };

    const dataFromDBButWrong = { ...mockProfileData, id: mockAnotherUserId };
    mockProfileUserRepository.viewProfile.mockResolvedValue(dataFromDBButWrong);

    await expect(profileUserUseCase.execute(mockRequest)).rejects.toThrow(
      UserAccessDeniedError
    );

    expect(mockProfileUserRepository.viewProfile).toHaveBeenCalledWith(
      mockUserId
    );
  });
});
