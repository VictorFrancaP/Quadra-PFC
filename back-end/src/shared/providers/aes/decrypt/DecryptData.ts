// Importando interface a ser implementada nesta classe
import { IDecryptData } from "./IDecryptData";

// Importando crypto
import crypto, { createDecipheriv } from "crypto";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// exportando classe de descriptografar
export class DecryptData implements IDecryptData {
  async decrypted(data: string): Promise<string> {
    const AES = "aes-256-cbc";
    const KEY = crypto.scryptSync(process.env.KEY as string, "salt", 32);

    const [ivHex, encryptedHex] = data.split(":");
    const ivBuffer = Buffer.from(ivHex!, "hex");
    const encryptedBuffer = Buffer.from(encryptedHex!, "hex");

    const decipher = createDecipheriv(AES, KEY, ivBuffer);
    const decrypted = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  }
}
