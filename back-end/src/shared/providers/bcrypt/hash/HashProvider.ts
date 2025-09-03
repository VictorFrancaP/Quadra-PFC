// Importando interface a ser implementada nesta classe e hash do bcryptjs
import { IHashProvider } from "./IHashProvider";
import { hash } from "bcryptjs";

// exportando classe de implementação de interface
export class HashProvider implements IHashProvider {
  async hashPassword(data: string): Promise<string> {
    return await hash(data, 12);
  }
}
