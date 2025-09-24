// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindSoccersRepository } from "../../../infrastruture/repository/soccer/FindSoccersRepository";
import { DecryptData } from "../../../shared/providers/aes/decrypt/DecryptData";

// Importando usecase
import { FindSoccersUseCase } from "../../../application/usecases/soccer/list/FindSoccersUseCase";

// Importando error personalizado
import { SoccersNotFoundError } from "../../../shared/errors/soccer-error/SoccersNotFoundError";

// exportando controller
export class FindSoccersController {
  async handle(request: Request, response: Response) {
    // instâncias das interfaces implementadas
    const findSoccersRepository = new FindSoccersRepository();
    const decryptData = new DecryptData();

    // instância da usecase
    const useCase = new FindSoccersUseCase(findSoccersRepository, decryptData);

    // criando try/catch para a captura de erros na execução
    try {
      const soccers = await useCase.execute();

      return response.status(200).json(soccers);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de nenhuma quadra encontrada na base de dados
      if (err instanceof SoccersNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      throw new Error(err.message);
    }
  }
}
