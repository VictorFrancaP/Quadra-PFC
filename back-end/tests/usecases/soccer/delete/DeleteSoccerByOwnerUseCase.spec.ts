import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteSoccerByOwnerUseCase } from '../../../../src/application/usecases/soccer/delete/DeleteSoccerByOwnerUseCase';
import { UserNotFoundError } from '../../../../src/shared/errors/user-error/UserNotFoundError';
import { SoccerAccessDeniedDeleteError } from '../../../../src/shared/errors/soccer-error/SoccerAccessDeniedError';
import { User } from '../../../../src/domain/entities/User';


const mockOwnerId = 'owner-id-123';
const mockUserId = 'user-id-456';

const mockOwnerUser = { id: mockOwnerId, role: 'OWNER' };
const mockRegularUser = { id: mockUserId, role: 'USER' };


const mockFindUserByIdRepository = { findUserById: vi.fn(), };
const mockDeleteSoccerByOwnerRepository = { deleteSoccerByOwner: vi.fn(), };

let deleteSoccerByOwnerUseCase: DeleteSoccerByOwnerUseCase;

describe('DeleteSoccerByOwnerUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks(); 
    
    mockFindUserByIdRepository.findUserById.mockResolvedValue(mockOwnerUser as User);
    mockDeleteSoccerByOwnerRepository.deleteSoccerByOwner.mockResolvedValue(undefined);

    deleteSoccerByOwnerUseCase = new DeleteSoccerByOwnerUseCase(
        mockFindUserByIdRepository,
        mockDeleteSoccerByOwnerRepository
    );
  });
  
  it('deve chamar o deleteRepository com o ID do usuário quando a permissão OWNER for verificada', async () => {
    const mockRequest = { userId: mockOwnerId };

    await expect(deleteSoccerByOwnerUseCase.execute(mockRequest)).resolves.toBeUndefined();

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(mockOwnerId);

    expect(mockDeleteSoccerByOwnerRepository.deleteSoccerByOwner).toHaveBeenCalledTimes(1);
    expect(mockDeleteSoccerByOwnerRepository.deleteSoccerByOwner).toHaveBeenCalledWith(mockOwnerId);
  });

  it('deve lançar UserNotFoundError se o usuário solicitante não for encontrado', async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    const mockRequest = { userId: 'non-existent-user' };

    await expect(deleteSoccerByOwnerUseCase.execute(mockRequest)).rejects.toThrow(UserNotFoundError);
    expect(mockDeleteSoccerByOwnerRepository.deleteSoccerByOwner).not.toHaveBeenCalled();
  });

  it('deve lançar SoccerAccessDeniedDeleteError se o usuário não for um OWNER', async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(mockRegularUser as User);
    const mockRequest = { userId: mockUserId };

    await expect(deleteSoccerByOwnerUseCase.execute(mockRequest)).rejects.toThrow(SoccerAccessDeniedDeleteError);
    
    expect(mockDeleteSoccerByOwnerRepository.deleteSoccerByOwner).not.toHaveBeenCalled();
  });
});