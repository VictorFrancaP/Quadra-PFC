import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteSoccerByAdminUseCase } from '../../../../src/application/usecases/soccer/delete/DeleteSoccerByAdminUseCase';
import { UserNotFoundError } from '../../../../src/shared/errors/user-error/UserNotFoundError';
import { SoccerAccessDeniedDeleteError, SoccerAccessDeniedError } from '../../../../src/shared/errors/soccer-error/SoccerAccessDeniedError';
import { SoccerNotFoundError } from '../../../../src/shared/errors/soccer-error/SoccerNotFoundError';
import { User } from '../../../../src/domain/entities/User';


const mockAdminId = 'admin-id-123';
const mockUserId = 'user-id-456';
const mockSoccerId = 'soccer-to-delete-id';

const mockAdminUser = { id: mockAdminId, role: 'ADMIN' };
const mockRegularUser = { id: mockUserId, role: 'USER' };

const mockInactiveSoccer = { id: mockSoccerId, isActive: false, name: 'Inactive Court' };
const mockActiveSoccer = { id: mockSoccerId, isActive: true, name: 'Active Court' };

const mockFindUserByIdRepository = { findUserById: vi.fn(), };
const mockFindSoccerByIdRepository = { findSoccerById: vi.fn(), };
const mockDeleteSoccerByAdminRepository = { deleteSoccerByAdmin: vi.fn(), };

let deleteSoccerByAdminUseCase: DeleteSoccerByAdminUseCase;

describe('DeleteSoccerByAdminUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks(); 
    
    mockFindUserByIdRepository.findUserById.mockResolvedValue(mockAdminUser as User);
    mockFindSoccerByIdRepository.findSoccerById.mockResolvedValue(mockInactiveSoccer);
    mockDeleteSoccerByAdminRepository.deleteSoccerByAdmin.mockResolvedValue(undefined);

    deleteSoccerByAdminUseCase = new DeleteSoccerByAdminUseCase(
        mockFindUserByIdRepository,
        mockFindSoccerByIdRepository,
        mockDeleteSoccerByAdminRepository
    );
  });
  
  it('deve deletar a quadra com sucesso se o ADMIN solicitar e a quadra estiver INATIVA', async () => {
    const mockRequest = { userId: mockAdminId, id: mockSoccerId };

    await expect(deleteSoccerByAdminUseCase.execute(mockRequest)).resolves.toBeUndefined();

    expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(mockAdminId);

    expect(mockFindSoccerByIdRepository.findSoccerById).toHaveBeenCalledWith(mockSoccerId);

    expect(mockDeleteSoccerByAdminRepository.deleteSoccerByAdmin).toHaveBeenCalledWith(mockSoccerId);
  });

  it('deve lançar UserNotFoundError se o usuário solicitante não for encontrado', async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
    const mockRequest = { userId: 'non-existent', id: mockSoccerId };

    await expect(deleteSoccerByAdminUseCase.execute(mockRequest)).rejects.toThrow(UserNotFoundError);
    expect(mockFindSoccerByIdRepository.findSoccerById).not.toHaveBeenCalled();
  });

  it('deve lançar SoccerAccessDeniedError se o usuário não for ADMIN', async () => {
    mockFindUserByIdRepository.findUserById.mockResolvedValue(mockRegularUser as User);
    const mockRequest = { userId: mockUserId, id: mockSoccerId };

    await expect(deleteSoccerByAdminUseCase.execute(mockRequest)).rejects.toThrow(SoccerAccessDeniedError);
    expect(mockFindSoccerByIdRepository.findSoccerById).not.toHaveBeenCalled();
    expect(mockDeleteSoccerByAdminRepository.deleteSoccerByAdmin).not.toHaveBeenCalled();
  });

  
  it('deve lançar SoccerNotFoundError se a quadra não for encontrada', async () => {
    mockFindSoccerByIdRepository.findSoccerById.mockResolvedValue(null);
    const mockRequest = { userId: mockAdminId, id: mockSoccerId };

    await expect(deleteSoccerByAdminUseCase.execute(mockRequest)).rejects.toThrow(SoccerNotFoundError);
    expect(mockDeleteSoccerByAdminRepository.deleteSoccerByAdmin).not.toHaveBeenCalled();
  });

  it('deve lançar SoccerAccessDeniedDeleteError se a quadra estiver ATIVA', async () => {
    mockFindSoccerByIdRepository.findSoccerById.mockResolvedValue(mockActiveSoccer);
    const mockRequest = { userId: mockAdminId, id: mockSoccerId };

    await expect(deleteSoccerByAdminUseCase.execute(mockRequest)).rejects.toThrow(SoccerAccessDeniedDeleteError);
    expect(mockDeleteSoccerByAdminRepository.deleteSoccerByAdmin).not.toHaveBeenCalled();
  });
});