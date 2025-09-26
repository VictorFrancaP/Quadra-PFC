// Importando authenticator do otplib para gerar o secret factor aleatorio e verificar o token
import { authenticator } from "otplib";

// importando interface a ser implementada nesta classe
import { ITotpProvider } from "./ITotpProvider";

authenticator.options = {
  window: 1,
};

// exportando classe de implementação de interface
export class TotpProvider implements ITotpProvider {
  generateSecret(email: string): { secret: string; otpAuthUrl: string } {
    // variavel com o nome do serviço
    const PLATAFORM_NAME = "Plataforma de Locação de Quadras";

    // gerando secret factor aleatorio para o usuário
    const secret = authenticator.generateSecret();

    // gera a URL do QRCode para o usuário escanear
    const otpAuthUrl = authenticator.keyuri(email, PLATAFORM_NAME, secret);

    // retornando dados esperados pela função
    return { secret, otpAuthUrl };
  }

  verifyToken(token: string, secret: string): boolean {
    //   verificando se o token digitado pelo usuário está válido
    return authenticator.verify({ token, secret });
  }
}
