// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindReservationUserActiveRepositories } from "../../../../domain/repositories/reservation/IFindReservationUserActiveRepositories";
import { IDeleteUserRepositories } from "../../../../domain/repositories/user/IDeleteUserRepositories";

// Importando interface de dados
import { IDeleteUserDTO } from "../../../dtos/user/delete/IDeleteUserDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { ReservationUserActiveError } from "../../../../shared/errors/reservation-error/ReservationUserActiveError";

// exportando usecase
export class DeleteUserUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findReservationUserActiveRepositories: IFindReservationUserActiveRepositories,
    private readonly deleteUserRepository: IDeleteUserRepositories
  ) {}

  async execute(data: IDeleteUserDTO): Promise<void> {
    // procurando usuário pelo id
    const userAlreadyExists = await this.findUserByIdRepository.findUserById(
      data.userId
    );

    // caso não encontre nenhum usuário, retorna um erro
    if (!userAlreadyExists) {
      throw new UserNotFoundError();
    }

    // verificando se existe uma reserva vigente
    const hasActiveReservation =
      await this.findReservationUserActiveRepositories.findReservationActive(
        userAlreadyExists.id as string
      );

    // caso encontre uma reserva ativa, retorna um erro
    if (hasActiveReservation) {
      throw new ReservationUserActiveError();
    }

    // deletando usuario no banco de dados
    return await this.deleteUserRepository.deleteUser(
      userAlreadyExists.id as string
    );
  }
}
