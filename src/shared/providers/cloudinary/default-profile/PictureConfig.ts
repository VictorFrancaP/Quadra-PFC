// Importando interface a ser implementada
import { IPictureConfig } from "./IPictureConfig";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// exportando classe de implementação de interface
export class PictureConfig implements IPictureConfig {
  profileImageDefault: string;
  logoMain: string;
  constructor() {
    this.profileImageDefault =
      (process.env.CLOUDINARY_PROFILE_DEFAULT as string) || "";
    this.logoMain = (process.env.CLOUDINARY_LOGO_MAIN as string) || "";
  }
}
