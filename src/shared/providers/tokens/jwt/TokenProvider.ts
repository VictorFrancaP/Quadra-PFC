// Importando jsonwebtoken e interface a ser implementada nesta classe
import jwt from "jsonwebtoken";
import { ITokenProvider, ITokenRequest } from "./ITokenProvider";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// exportando classe de implementação de interface
export class TokenProvider implements ITokenProvider {
  async generateTokenUser(tokenPayload: ITokenRequest): Promise<string> {
    // criando token jwt
    const token = jwt.sign(
      { role: tokenPayload.role },
      process.env.JWT_SECRET!,
      {
        subject: tokenPayload.id,
        expiresIn: "15m",
      }
    );

    // retornando token
    return token;
  }
}
