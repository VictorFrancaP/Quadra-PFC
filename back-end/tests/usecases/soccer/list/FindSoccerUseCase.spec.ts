import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FindSoccerUseCase } from '../../../../src/application/usecases/soccer/list/FindSoccerUseCase';
import { ISoccerWithRating } from '../../../../src/application/usecases/soccer/list/FindSoccerUseCase';
import { UserNotFoundError } from '../../../../src/shared/errors/user-error/UserNotFoundError';
import { SoccerNotFoundError } from '../../../../src/shared/errors/soccer-error/SoccerNotFoundError';
import { User } from '../../../../src/domain/entities/User';
import { Soccer } from '../../../../src/domain/entities/Soccer';
import { IFindSoccerRatingsRepositories } from '../../../../src/domain/repositories/rating/IFindSoccerRatingsRepositories';
import { IFindSoccerRatingRepositories } from '../../../../src/domain/repositories/rating/IFindSoccerRatingRepositories';

const mockUserId = 'user-logado-id';
const mockSoccerId = 'quadra-id-999';

const encryptedCnpj = 'ENCRYPTED_CNPJ_DATA';
const decryptedCnpj = '12.345.678/0001-90';
const encryptedFone = 'ENCRYPTED_FONE_DATA';
const decryptedFone = '(11) 98765-4321';
const mockUser = { id: mockUserId, role: 'USER' };

const mockSoccerData = {
    id: mockSoccerId,
    userId: 'owner-123',
    cnpj: encryptedCnpj,
    fone: encryptedFone,
    name: 'Quadra Teste', description: 'Desc', cep: '12345000', address: 'Address', city: 'City', state: 'SP',
    operationDays: ['SEG'], openHour: '08:00', closingHour: '22:00', priceHour: 50.0, maxDuration: 2, isActive: true, 
    userName: 'Owner Name', images: ['img.jpg'], latitude: -23, longitude: -46, ownerPixKey: 'pixkey', observations: 'obs',
};

const mockFindUserByIdRepository = { findUserById: vi.fn() };
const mockFindSoccerByIdRepository = { findSoccerById: vi.fn() };
const mockDecryptData = { decrypted: vi.fn() };
const mockFindSoccerRatingsRepository = { findSoccerRatings: vi.fn() };
const mockFindUserRatingRepository = { findUserRating: vi.fn() };

const mockFindSoccerAverageUseCase = {
    execute: vi.fn(),
    findSoccerRatingsRepository: mockFindSoccerRatingsRepository as unknown as IFindSoccerRatingsRepositories,
    findSoccerRatingRepository: mockFindUserRatingRepository as unknown as IFindSoccerRatingRepositories, 
};

let findSoccerUseCase: FindSoccerUseCase;

describe('FindSoccerUseCase', () => {
    beforeEach(() => {
        vi.clearAllMocks(); 
        
        mockFindUserByIdRepository.findUserById.mockResolvedValue(mockUser as User);
        mockFindSoccerByIdRepository.findSoccerById.mockResolvedValue(mockSoccerData as Soccer);
        
        mockDecryptData.decrypted.mockImplementation((encryptedValue) => {
            if (encryptedValue === encryptedCnpj) return Promise.resolve(decryptedCnpj);
            if (encryptedValue === encryptedFone) return Promise.resolve(decryptedFone);
            return Promise.resolve(encryptedValue);
        });
        
        mockFindSoccerRatingsRepository.findSoccerRatings.mockResolvedValue(Array(5).fill({ rating: 4 }));
        mockFindSoccerAverageUseCase.execute.mockResolvedValue({
            average: 4.2,
            hasRated: true,
        });

        findSoccerUseCase = new FindSoccerUseCase(
            mockFindUserByIdRepository,
            mockFindSoccerByIdRepository,
            mockDecryptData,
            mockFindSoccerAverageUseCase as any,
            mockFindSoccerRatingsRepository
        );
    });
    
    it('deve retornar a quadra com dados descriptografados e informações de rating anexadas', async () => {
        const mockRequest = { userId: mockUserId, soccerId: mockSoccerId };
        const result = await findSoccerUseCase.execute(mockRequest) as ISoccerWithRating;
        expect(mockDecryptData.decrypted).toHaveBeenCalledTimes(2);
        expect(mockFindSoccerRatingsRepository.findSoccerRatings).toHaveBeenCalledWith(mockSoccerId);
        expect(mockFindSoccerAverageUseCase.execute).toHaveBeenCalledTimes(1);
        expect(result.cnpj).toBe(decryptedCnpj);
        expect(result.fone).toBe(decryptedFone);
        expect(result.averageRating).toBe(4.2);
        expect(result.ratingCount).toBe(5);
        expect(result.hasRated).toBe(true);
    });

    it('deve lançar UserNotFoundError se o usuário logado não for encontrado', async () => {
        mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
        const mockRequest = { userId: 'invalid-user', soccerId: mockSoccerId };

        await expect(findSoccerUseCase.execute(mockRequest)).rejects.toThrow(UserNotFoundError);
        expect(mockFindSoccerByIdRepository.findSoccerById).not.toHaveBeenCalled();
    });

    it('deve lançar SoccerNotFoundError se a quadra não for encontrada', async () => {
        mockFindSoccerByIdRepository.findSoccerById.mockResolvedValue(null);
        const mockRequest = { userId: mockUserId, soccerId: 'invalid-soccer' };

        await expect(findSoccerUseCase.execute(mockRequest)).rejects.toThrow(SoccerNotFoundError);
        expect(mockDecryptData.decrypted).not.toHaveBeenCalled();
    });
    
    it('deve retornar ratingCount zero se não houver avaliações', async () => {
        mockFindSoccerRatingsRepository.findSoccerRatings.mockResolvedValue(null);
        mockFindSoccerAverageUseCase.execute.mockResolvedValue({ average: 0, hasRated: false });

        const result = await findSoccerUseCase.execute({ userId: mockUserId, soccerId: mockSoccerId }) as ISoccerWithRating;
        expect(result.ratingCount).toBe(0);
        expect(result.averageRating).toBe(0);
        expect(result.hasRated).toBe(false);
    });
});