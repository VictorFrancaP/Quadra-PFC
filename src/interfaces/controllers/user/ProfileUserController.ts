// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { ProfileUserRepository } from "../../../infrastruture/repository/user/ProfileUserRepository";

// Importando usecase
import { ProfileUserUseCase } from "../../../application/usecases/user/list/ProfileUserUseCase";

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
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
