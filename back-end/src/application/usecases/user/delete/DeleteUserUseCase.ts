// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindReservationUserActiveRepositories } from "../../../../domain/repositories/reservation/IFindReservationUserActiveRepositories";
import { IFindLastReservationRepositories } from "../../../../domain/repositories/reservation/IFindLastReservationRepositories";
import { IDayJsProvider } from "../../../../shared/providers/dayjs/IDayJsProvider";
import { IDeleteUserRepositories } from "../../../../domain/repositories/user/IDeleteUserRepositories";

// Importando interface de dados
import { IDeleteUserDTO } from "../../../dtos/user/delete/IDeleteUserDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { ReservationUserActiveError } from "../../../../shared/errors/reservation-error/ReservationUserActiveError";
import { ReservationRecentError } from "../../../../shared/errors/reservation-error/ReservationRecentError";

// exportando usecase
export class DeleteUserUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findReservationUserActiveRepositories: IFindReservationUserActiveRepositories,
    private readonly findLastReservationRepositories: IFindLastReservationRepositories,
    private readonly dayJsProvider: IDayJsProvider,
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

    // buscando a data da ultima reserva realizada pelo usuário
    const lastReservationEndTime =
      await this.findLastReservationRepositories.findLastReservationEndTime(
        userAlreadyExists.id as string
      );

    // caso encontre, entra no if
    if (lastReservationEndTime) {
      // convertendo a data encontrada para dayjs e adicionando 5 dias
      const fiveDaysAfterLastReservation = (
        await this.dayJsProvider.parse(lastReservationEndTime)
      ).add(5, "day");

      // verifica se a hora atual é anterior aos 5 dias apos a ultima reserva
      const isDeletionIsPossible = (await this.dayJsProvider.now()).isBefore(
        fiveDaysAfterLastReservation
      );

      // caso a hora atual é anterior aos dias, entra no if
      if (isDeletionIsPossible) {
        // calculando dias faltantes para liberar usuário para deletar a conta
        const daysRemaining = fiveDaysAfterLastReservation.diff(
          await this.dayJsProvider.now(),
          "day"
        );

        // retornando erro
        throw new ReservationRecentError(daysRemaining);
      }
    }

    // deletando usuario no banco de dados
    return await this.deleteUserRepository.deleteUser(
      userAlreadyExists.id as string
    );
  }
}
