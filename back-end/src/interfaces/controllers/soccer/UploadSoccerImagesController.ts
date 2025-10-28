// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerByIdRepository } from "../../../infrastruture/repository/soccer/FindSoccerByIdRepository";
import { UpdateSoccerOwnerRepository } from "../../../infrastruture/repository/soccer/UpdateSoccerOwnerRepository";

// Importando usecase
import { UploadSoccerImagesUseCase } from "../../../application/usecases/soccer/images-soccer/UploadSoccerImagesUseCase";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../shared/errors/soccer-error/SoccerNotFoundError";
import { UserAccessDeniedSoccerError } from "../../../shared/errors/user-error/UserAccessDeniedError";
import { SoccerAccessDeniedUpdateError } from "../../../shared/errors/soccer-error/SoccerAccessDeniedError";
import { SoccerImagesError } from "../../../shared/errors/soccer-error/SoccerImagesError";
import { SoccerImagesLimitedError } from "../../../shared/errors/soccer-error/SoccerImagesLimitedError";

// exportando controller
export class UploadSoccerImagesController {
  async handle(request: Request, response: Response) {
    // usuário logado
    const userId = request.user.id;

    // id da quadra na url
    const { id: soccerId } = request.params;

    // imagens enviadas
    const files = request.files as Express.Multer.File[];

    // verificando se file não é 0
    if (!files || files.length === 0) {
      return response.status(400).json({ message: "Nenhuma imagem enviada!" });
    }

    // pegando images no cloudinary-storage
    const images = files.map((file) => file.path).filter(Boolean) as string[];

    // verificando se todas as url foram obtidas
    if (images.length !== files.length) {
      return response.status(400).json({
        message: "Erro ao realizar upload de imagens!",
      });
    }

    // instâncias das interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerByIdRepository = new FindSoccerByIdRepository();
    const updateSoccerOwnerRepository = new UpdateSoccerOwnerRepository();

    // instância da usecase
    const useCase = new UploadSoccerImagesUseCase(
      findUserByIdRepository,
      findSoccerByIdRepository,
      updateSoccerOwnerRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const result = await useCase.execute({
        userId,
        soccerId: soccerId as string,
        images,
      });

      return response.status(200).json({
        message: "Imagens enviadas com sucesso!",
        images: result.updatedImages,
      });
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de usuário não existe
      if (err instanceof UserNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de quadra não existe
      if (err instanceof SoccerNotFoundError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente
      if (err instanceof UserAccessDeniedSoccerError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de permissão insuficiente para quadra
      if (err instanceof SoccerAccessDeniedUpdateError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de imagens não encontradas
      if (err instanceof SoccerImagesError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro de limites de imagens excedido
      if (err instanceof SoccerImagesLimitedError) {
        return response.status(err.statusCode).json(err.message);
      }

      // erro desconhecido
      return response.status(500).json(err.message);
    }
  }
}
