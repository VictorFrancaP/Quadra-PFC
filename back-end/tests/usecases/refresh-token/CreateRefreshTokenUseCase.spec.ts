import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateRefreshTokenUseCase } from '../../../src/application/usecases/refresh-token/create/CreateRefreshTokenUseCase';
import { RefreshTokenNotFoundError } from '../../../src/shared/errors/refresh-token-error/RefreshTokenNotFoundError';
import { UserNotFoundError } from '../../../src/shared/errors/user-error/UserNotFoundError';
import { User } from '../../../src/domain/entities/User'; 

// --- Dados Mockados ---
const mockRefreshTokenId = 'valid-refresh-token-id';
const mockUserId = 'user-to-refresh-id';
const mockUserRole = 'USER';
const mockAccessToken = 'new-mock-access-token';
const mockRefreshToken = {
    id: mockRefreshTokenId,
    userId: mockUserId,
    role: mockUserRole,
};
const mockUser = {
    id: mockUserId,
    role: mockUserRole,
};
const mockFindUserRefreshTokenRepository = { findUserRefreshToken: vi.fn(), };
const mockTokenProvider = { generateTokenUser: vi.fn(), };
const mockFindUserByIdRepository = { findUserById: vi.fn(), };

let createRefreshTokenUseCase: CreateRefreshTokenUseCase;

describe('CreateRefreshTokenUseCase', () => {
    beforeEach(() => {
        vi.clearAllMocks(); 
        
        mockFindUserRefreshTokenRepository.findUserRefreshToken.mockResolvedValue(mockRefreshToken);
        mockFindUserByIdRepository.findUserById.mockResolvedValue(mockUser as User);
        mockTokenProvider.generateTokenUser.mockResolvedValue(mockAccessToken);

        createRefreshTokenUseCase = new CreateRefreshTokenUseCase(
            mockFindUserRefreshTokenRepository,
            mockTokenProvider,
            mockFindUserByIdRepository
        );
    });
    
    it('deve gerar um novo access token quando o refresh token e o usuário forem válidos', async () => {
        const mockRequest = { refreshToken: mockRefreshTokenId };

        const result = await createRefreshTokenUseCase.execute(mockRequest);

        expect(mockFindUserRefreshTokenRepository.findUserRefreshToken).toHaveBeenCalledWith(mockRefreshTokenId);

        expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(mockUserId);

        expect(mockTokenProvider.generateTokenUser).toHaveBeenCalledWith({
            id: mockUserId,
            role: mockUserRole,
        });

        expect(result.token).toBe(mockAccessToken);
        expect(result.user).toEqual(mockUser);
    });

    it('deve lançar RefreshTokenNotFoundError se o refresh token não for encontrado', async () => {
        mockFindUserRefreshTokenRepository.findUserRefreshToken.mockResolvedValue(null);
        const mockRequest = { refreshToken: 'invalid-token' };

        await expect(createRefreshTokenUseCase.execute(mockRequest)).rejects.toThrow(RefreshTokenNotFoundError);
        
        expect(mockFindUserByIdRepository.findUserById).not.toHaveBeenCalled();
        expect(mockTokenProvider.generateTokenUser).not.toHaveBeenCalled();
    });

    it('deve lançar UserNotFoundError se o usuário associado ao refresh token não for encontrado', async () => {
        mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
        const mockRequest = { refreshToken: mockRefreshTokenId };

        await expect(createRefreshTokenUseCase.execute(mockRequest)).rejects.toThrow(UserNotFoundError);
        
        expect(mockTokenProvider.generateTokenUser).not.toHaveBeenCalled();
    });
});