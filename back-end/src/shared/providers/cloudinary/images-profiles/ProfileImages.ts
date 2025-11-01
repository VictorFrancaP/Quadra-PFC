// Importando interface a ser implementada nesta classe
import { IProfileImages } from "./IProfileImages";

// exportando classe de implementação de interface
export class ProfileImages implements IProfileImages {
  async getImages(): Promise<string[]> {
    // armazenando imagens do cloudinary
    const profilesImages: string[] = [];

    // retornando imagens
    return profilesImages;
  }
}
