// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUsersRepository } from "../../../infrastruture/repository/user/FindUsersRepository";
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";

// Importando usecase
import { FindUsersUseCase } from "../../../application/usecases/user/list/FindUsersUseCase";

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
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
