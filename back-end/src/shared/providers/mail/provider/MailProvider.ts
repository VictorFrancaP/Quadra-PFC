import { IMailProvider, IMailRequest } from "./IMailProvider";
// Certifique-se que este import está apontando para o arquivo mailConfig COM A PORTA 587
import { mailConfig } from "../mailConfig";
import dotenv from "dotenv";
import { SendMailError } from "../../../errors/send-mail-error/SendMailError";
import { UnknownError } from "../../../errors/UnknownError";

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
    // CORREÇÃO 1: O remetente deve ser o EMAIL_USER, não o HOST
    // Se MAIL_USER não estiver definido, usa uma string fixa para teste
    const senderEmail = process.env.MAIL_USER || process.env.MAIL_HOST;

    const mailOptions = {
      to: mailPayload.email,
      from: `Quadra Marcada <${senderEmail}>`, // Formato padrão de e-mail
      subject: mailPayload.subject,
      text: `Quadra Marcada Informa`,
      html: mailPayload.content,
    };

    console.log(
      `[MAIL PROVIDER] Tentando enviar e-mail para: ${mailPayload.email}`
    );

    try {
      // AQUI É ONDE ESTÁ TRAVANDO. O log abaixo vai provar isso.
      const info = await mailConfig.sendMail(mailOptions);

      console.log(`[MAIL PROVIDER] Sucesso! ID do envio: ${info.messageId}`);
    } catch (err: any) {
      console.error("[MAIL PROVIDER] ERRO CRÍTICO NO ENVIO:", err);

      if (err instanceof Error) {
        throw new SendMailError();
      }
      throw new UnknownError();
    }
  }
}
