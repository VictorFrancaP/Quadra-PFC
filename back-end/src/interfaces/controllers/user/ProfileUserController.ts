// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { ProfileUserRepository } from "../../../infrastruture/repository/user/ProfileUserRepository";

// Importando usecase
import { ProfileUserUseCase } from "../../../application/usecases/user/list/ProfileUserUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedError } from "../../../shared/errors/user-error/UserAccessDeniedError";

// exportando controller
export class ProfileUserController {
  async handle(request: Request, response: Response) {
    // pegando id do usuário
    const userId = request.user.id;

    // instânciando interfaces implementadas
    const profileUserRepository = new ProfileUserRepository();

    // Instânciando usecase
    const useCase = new ProfileUserUseCase(profileUserRepository);

    // criando try/catch para a captura de erros na execução
    try {
      const profile = await useCase.execute({ userId });

      return response.status(200).json({ profile });
    } catch (err: any) {
      
      // tratando erros de separada

      // erro de usuário não encontrado na base de dados
      if(err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente para o usuário acessar essa rota
      if(err instanceof UserAccessDeniedError) {
        return response.status(err.statusCode).json(err.message);
      }

      // retornando erro desconhecido
      return response.status(500).json({
        message: err.message,
      });
    }
  }
}
