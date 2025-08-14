// Importando interface a ser implementada nesta classe
import { IEncryptData } from "./IEncryptData";

// Importando crypto do nodejs
import crypto, { createDecipheriv } from "crypto";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// exportando classe de criptografia de dados
export class EncryptData implements IEncryptData {
  async encrypted(data: string): Promise<string> {
    const AES = "aes-256-cbc";
    const KEY = crypto.scryptSync(process.env.KEY as string, "salt", 32);
    const IV = crypto.randomBytes(16);

    // criando criptografia
    const cipher = createDecipheriv(AES, KEY, IV);
    const encrypted = Buffer.concat([
      cipher.update(data, "utf8"),
      cipher.final(),
    ]);

    // retornando criptografia
    return IV.toString("hex") + ":" + encrypted.toString("hex");
  }
}
