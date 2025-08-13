// Importando interface a ser implementada nesta classe e compare do bcryptjs
import { ICompareProvider } from "./ICompareProvider";
import { compare } from "bcryptjs";

// exportando classe de implementação de interface
export class CompareProvider implements ICompareProvider {
  async comparePassword(data: string, hashed: string): Promise<boolean> {
    return await compare(data, hashed);
  }
}
