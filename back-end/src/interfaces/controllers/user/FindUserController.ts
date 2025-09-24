// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserPartialByEmailRepository } from "../../../infrastruture/repository/user/FindUserPartialByEmailRepository";
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";

// Importando usecase
import { FindUserUseCase } from "../../../application/usecases/user/list/FindUserUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedError } from "../../../shared/errors/user-error/UserAccessDeniedError";

// exportando controller
export class FindUserController {
  async handle(request: Request, response: Response) {
    // pegando e-mail do body e id do usuário autenticado
    const { email } = request.body;
    const userId = request.user.id;

    // instânciando interfaces implementadas
    const findUserPartialByEmailRepository =
      new FindUserPartialByEmailRepository();
    const findUserByIdRepository = new FindUserByIdRepository();

    // instânciando usecase
    const useCase = new FindUserUseCase(
      findUserPartialByEmailRepository,
      findUserByIdRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const user = await useCase.execute({ email, userId });

      return response.status(200).json({
        message: "Usuário encontrado com sucesso!",
        user,
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não encontrado na base de dados
      if(err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de usuário não tem permissão para realizar esta ação
      if(err instanceof UserAccessDeniedError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
