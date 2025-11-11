import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FindReservationSoccerUseCase } from '../../../../src/application/usecases/reservation/FindReservationSoccerUseCase';
import { UserNotFoundError } from '../../../../src/shared/errors/user-error/UserNotFoundError';
import { UserAccessDeniedRoleSameError } from '../../../../src/shared/errors/user-error/UserAccessDeniedError';
import { SoccerNotFoundError } from '../../../../src/shared/errors/soccer-error/SoccerNotFoundError';
import { ReservationsNotFoundError } from '../../../../src/shared/errors/reservation-error/ReservationNotFoundError';
import { User } from '../../../../src/domain/entities/User';
import { Reservation } from '../../../../src/domain/entities/Reservation';
import { Soccer } from '../../../../src/domain/entities/Soccer';

const mockOwnerId = 'owner-id-123';
const mockRegularUserId = 'user-id-456';
const mockSoccerId = 'soccer-id-789';

const mockOwnerUser = { id: mockOwnerId, role: 'OWNER' };
const mockRegularUser = { id: mockRegularUserId, role: 'USER' };
const mockSoccer = { id: mockSoccerId, userId: mockOwnerId };

const mockReservationsList: Reservation[] = [
    { id: 'res1', soccerId: mockSoccerId, userId: mockRegularUserId, statusPayment: 'CONFIRMED' },
    { id: 'res2', soccerId: mockSoccerId, userId: mockRegularUserId, statusPayment: 'PENDING' },
] as Reservation[];

const mockFindUserByIdRepository = { findUserById: vi.fn(), };
const mockFindSoccerOwnerRepository = { findSoccerOwner: vi.fn(), };
const mockFindReservationSoccerRepository = { findSoccerReservation: vi.fn(), };

let findReservationSoccerUseCase: FindReservationSoccerUseCase;

describe('FindReservationSoccerUseCase', () => {
    beforeEach(() => {
        vi.clearAllMocks(); 
        
        // Configuração Padrão de Sucesso:
        mockFindUserByIdRepository.findUserById.mockResolvedValue(mockOwnerUser as User);
        mockFindSoccerOwnerRepository.findSoccerOwner.mockResolvedValue(mockSoccer as Soccer);
        mockFindReservationSoccerRepository.findSoccerReservation.mockResolvedValue(mockReservationsList);

        findReservationSoccerUseCase = new FindReservationSoccerUseCase(
            mockFindUserByIdRepository,
            mockFindSoccerOwnerRepository,
            mockFindReservationSoccerRepository
        );
    });
    
    it('deve retornar a lista de reservas quando o solicitante é OWNER', async () => {
        const mockRequest = { userId: mockOwnerId };

        const result = await findReservationSoccerUseCase.execute(mockRequest);

        expect(mockFindUserByIdRepository.findUserById).toHaveBeenCalledWith(mockOwnerId);
        expect(mockFindSoccerOwnerRepository.findSoccerOwner).toHaveBeenCalledWith(mockOwnerId);

        expect(mockFindReservationSoccerRepository.findSoccerReservation).toHaveBeenCalledWith(mockSoccerId);
        expect(result).toEqual(mockReservationsList);
        expect(result.length).toBe(2);
    });


    it('deve lançar UserNotFoundError se o usuário solicitante não for encontrado', async () => {
        mockFindUserByIdRepository.findUserById.mockResolvedValue(null);
        const mockRequest = { userId: 'invalid-id' };

        await expect(findReservationSoccerUseCase.execute(mockRequest)).rejects.toThrow(UserNotFoundError);
        expect(mockFindSoccerOwnerRepository.findSoccerOwner).not.toHaveBeenCalled();
    });

    it('deve lançar UserAccessDeniedRoleSameError se o usuário não for OWNER', async () => {
        mockFindUserByIdRepository.findUserById.mockResolvedValue(mockRegularUser as User);
        const mockRequest = { userId: mockRegularUserId };

        await expect(findReservationSoccerUseCase.execute(mockRequest)).rejects.toThrow(UserAccessDeniedRoleSameError);
        expect(mockFindSoccerOwnerRepository.findSoccerOwner).not.toHaveBeenCalled();
    });

    it('deve lançar SoccerNotFoundError se o OWNER não tiver quadra cadastrada', async () => {
        mockFindSoccerOwnerRepository.findSoccerOwner.mockResolvedValue(null);
        const mockRequest = { userId: mockOwnerId };

        await expect(findReservationSoccerUseCase.execute(mockRequest)).rejects.toThrow(SoccerNotFoundError);
        expect(mockFindReservationSoccerRepository.findSoccerReservation).not.toHaveBeenCalled();
    });

    it('deve lançar ReservationsNotFoundError se nenhuma reserva for encontrada para a quadra', async () => {
        mockFindReservationSoccerRepository.findSoccerReservation.mockResolvedValue([]);
        const mockRequest = { userId: mockOwnerId };

        await expect(findReservationSoccerUseCase.execute(mockRequest)).rejects.toThrow(ReservationsNotFoundError);
    });
    
    it('deve lançar ReservationsNotFoundError se a busca de reservas retornar null', async () => {
        mockFindReservationSoccerRepository.findSoccerReservation.mockResolvedValue(null);
        const mockRequest = { userId: mockOwnerId };

        await expect(findReservationSoccerUseCase.execute(mockRequest)).rejects.toThrow(ReservationsNotFoundError);
    });
});