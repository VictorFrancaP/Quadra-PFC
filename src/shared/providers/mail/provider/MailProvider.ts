// Importando interface a ser implementada nesta classe e mailConfig (nodemailer transporter)
import { IMailProvider } from "./IMailProvider";
import { IMailRequest } from "./IMailProvider";
import { mailConfig } from "../mailConfig";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Importando erro personalizado
import { SendMailError } from "../../../errors/SendMailError";
import { UnknownError } from "../../../errors/UnknownError";

// exportando classe de implementação de interface
export class MailProvider implements IMailProvider {
  async send(mailPayload: IMailRequest): Promise<void> {
    // criando objeto de envio do e-mail
    const mailOptions = {
      to: mailPayload.email,
      from: process.env.MAIL_HOST,
      subject: mailPayload.subject,
      text: `Quadra Marcada Informa`,
      html: mailPayload.content,
    };

    // criando try/catch para a captura de erros na execução
    try {
      await mailConfig.sendMail(mailOptions);
    } catch (err: any) {
      if (err instanceof Error) {
        throw new SendMailError();
      }

      throw new UnknownError();
    }
  }

  linkConfirm: string;
  constructor() {
    this.linkConfirm = `${process.env.FRONT_HOST}/auth/user/create-account`;
  }
}
