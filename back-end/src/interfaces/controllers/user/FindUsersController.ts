// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUsersRepository } from "../../../infrastruture/repository/user/FindUsersRepository";
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";

// Importando usecase
import { FindUsersUseCase } from "../../../application/usecases/user/list/FindUsersUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UsersNotFoundError } from "../../../shared/errors/user-error/UserFoundError";
import { UsersAccessDeniedError } from "../../../shared/errors/user-error/UserAccessDeniedError";

// exportando controller
export class FindUsersController {
  async handle(request: Request, response: Response) {
    // pegando id do usuário logado
    const userId = request.user.id;

    // instânciando interfaces implementadas
    const findUsersRepository = new FindUsersRepository();
    const findUserByIdRepository = new FindUserByIdRepository();

    // instância da usecase
    const useCase = new FindUsersUseCase(
      findUserByIdRepository,
      findUsersRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const users = await useCase.execute({ userId });

      return response.status(200).json(users);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuario não encontrado na base de dados
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de nenhum usuario encontrado na base de dados
      if (err instanceof UsersNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de usuário não tem permissão para efetuar esta requisição
      if (err instanceof UsersAccessDeniedError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
