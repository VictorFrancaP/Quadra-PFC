// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas
import { FindUserSolicitationOwnerRepository } from "../../../infrastruture/repository/solicitations/FindUserSolicitationOwnerRepository";
import { FindUserCnpjSolicitationOwnerRepository } from "../../../infrastruture/repository/solicitations/FindUserCnpjSolicitationOwnerRepository";
import { CreateSolicitationOwnerRepository } from "../../../infrastruture/repository/solicitations/CreateSolicitationOwnerRepository";

// Importando usecase
import { CreateSolicitationOwnerUseCase } from "../../../application/usecases/solicitations/CreateSolicitationOwnerUseCase";

// exportando controller
export class CreateSolicitationOwnerController {
  async handle(request: Request, response: Response) {
    // pegando id do usuário
    const userId = request.user.id;
    const { localName, description, cnpj, fone } = request.body;

    // instânciando interfaces implementadas
    const findUserSolicitationOwnerRepository =
      new FindUserSolicitationOwnerRepository();
    const findUserCnpjSolicitationOwnerRepository =
      new FindUserCnpjSolicitationOwnerRepository();
    const createSolicitationOwnerRepository =
      new CreateSolicitationOwnerRepository();

    // instânciando usecase
    const useCase = new CreateSolicitationOwnerUseCase(
      findUserSolicitationOwnerRepository,
      findUserCnpjSolicitationOwnerRepository,
      createSolicitationOwnerRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const solicitationUser = await useCase.execute({
        localName,
        description,
        cnpj,
        fone,
        userId,
      });

      return response.status(200).json({
        message:
          "Sua solicitação para ser proprietário foi criada com sucesso!",
        solicitationUser,
      });
    } catch (err: any) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
