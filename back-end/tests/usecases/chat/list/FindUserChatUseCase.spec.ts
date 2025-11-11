import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FindUserChatsUseCase } from '../../../../src/application/usecases/chat/FindChatsUseCase';
import { UserNotFoundError } from '../../../../src/shared/errors/user-error/UserNotFoundError';
import { User } from '../../../../src/domain/entities/User';
import { Chat } from '../../../../src/domain/entities/Chat';
import { IFindChatsDTO } from '../../../../src/application/dtos/chat/IFindChatsDTO';

const mockUserId = 'user-logado-id';
const mockOtherUserId = 'other-user-id';
const mockUser = { id: mockUserId, role: 'USER' }; 
const mockChatsList: Chat[] = [
    { id: 'c1', participantIds: [mockUserId, mockOtherUserId] },
    { id: 'c2', participantIds: [mockUserId, 'another-id'] },
] as Chat[];
const mockFindUserByIdRepository = { findUserById: vi.fn(), };
const mockFindChatsByUserRepository = { findChatsByUser: vi.fn(), };

let findUserChatsUseCase: FindUserChatsUseCase;

describe('FindUserChatsUseCase', () => {
    beforeEach(() => {
        vi.clearAllMocks(); 
        
        mockFindUserByIdRepository.findUserById.mockResolvedValue(mockUser as User);
        mockFindChatsByUserRepository.findChatsByUser.mockResolvedValue(mockChatsList);

        findUserChatsUseCase = new FindUserChatsUseCase(
            mockFindUserByIdRepository,
            mockFindChatsByUserRepository
        );
    });
    
    it('deve retornar a lista de chats do usuário logado', async () => {
        const mockRequest: IFindChatsDTO = { userId: mockUserId };

        const result = await findUserChatsUseCase.execute(mockRequest);

        expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(mockUserId);

        expect(mockFindChatsByUserRepository.findChatsByUser).toHaveBeenCalledWith(mockUserId);

        expect(result).toEqual(mockChatsList);
        expect(result.length).toBe(2);
    });


    it('deve lançar UserNotFoundError se o usuário logado não for encontrado', async () => {
        mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
        const mockRequest: IFindChatsDTO = { userId: 'invalid-user' };

        await expect(findUserChatsUseCase.execute(mockRequest)).rejects.toThrow(UserNotFoundError);
        
        expect(mockFindChatsByUserRepository.findChatsByUser).not.toHaveBeenCalled();
    });

    it('deve retornar um array vazio se o usuário não tiver conversas', async () => {
        mockFindChatsByUserRepository.findChatsByUser.mockResolvedValue([]);
        const mockRequest: IFindChatsDTO = { userId: mockUserId };

        const result = await findUserChatsUseCase.execute(mockRequest);

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });
});