// Importando interface a ser implementada
import { IResetTokenProvider } from "./IResetTokenProvider";

// Importando crypto do nodejs para a geração do token
import crypto from "crypto";

// exportando classe de implementação de interface
export class ResetTokenProvider implements IResetTokenProvider {
  async generateToken(): Promise<string> {
    // gerando token
    return crypto.randomBytes(32).toString("hex");
  }
}
