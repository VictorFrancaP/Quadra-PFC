// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interface implementada a ser instânciada nesta classe
import { ProfileImages } from "../../../shared/providers/cloudinary/images-profiles/ProfileImages";

// Importando usecase
import { GetProfileImagesUserUseCase } from "../../../application/usecases/user/profile/GetProfileImagesUserUseCase";

// exportando usecase
export class GetProfileImagesUserController {
  async handle(request: Request, response: Response) {
    // instânciando interface implementada
    const profileImages = new ProfileImages();

    // instânciando usecase
    const useCase = new GetProfileImagesUserUseCase(profileImages);

    // criando try/catch para capturar erros na execução
    try {
      const images = await useCase.execute();

      return response.status(200).json(images);
    } catch (err: any) {
      return response.status(500).json(err.message);
    }
  }
}
