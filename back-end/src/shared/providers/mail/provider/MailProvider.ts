import { IMailProvider, IMailRequest } from "./IMailProvider";
import { mailConfig } from "../mailConfig"; // Importa o arquivo acima
import dotenv from "dotenv";
import { SendMailError } from "../../../errors/send-mail-error/SendMailError";

dotenv.config();

export class MailProvider implements IMailProvider {
  linkConfirm: string;
  linkResetPassword: string;
  linkPlatform: string;

  constructor() {
    this.linkConfirm = `${process.env.FRONT_HOST}/auth/user/cadastrar`;
    this.linkResetPassword = `${process.env.FRONT_HOST}/user/reset-password`;
    this.linkPlatform = `${process.env.FRONT_HOST}/minha-quadra/reservas`;
  }

  async send(mailPayload: IMailRequest): Promise<void> {
    // ATENÇÃO: O 'from' TEM QUE SER o e-mail que você cadastrou no Brevo
    const senderEmail = process.env.MAIL_HOST;

    const mailOptions = {
      to: mailPayload.email,
      from: `Quadra Marcada <${senderEmail}>`,
      subject: mailPayload.subject,
      html: mailPayload.content,
    };

    console.log(
      `[MAIL PROVIDER] Enviando via Brevo para: ${mailPayload.email}`
    );

    try {
      await mailConfig.sendMail(mailOptions);
      console.log(`[MAIL PROVIDER] Sucesso!`);
    } catch (err: any) {
      console.error("[MAIL PROVIDER] Erro no envio:", err);
      throw new SendMailError();
    }
  }
}
