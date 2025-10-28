// Importando interface a ser implementada e instânciada na controller
import { IProfileImages } from "../../../../shared/providers/cloudinary/images-profiles/IProfileImages";

// exportando usecase
export class GetProfileImagesUserUseCase {
  constructor(private readonly profileImages: IProfileImages) {}

  async execute(): Promise<string[]> {
    // pegando imagens
    const images = await this.profileImages.getImages();

    // retornando imagens
    return images;
  }
}
