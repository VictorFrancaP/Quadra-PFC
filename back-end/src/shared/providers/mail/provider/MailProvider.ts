import { IMailProvider, IMailRequest } from "./IMailProvider";
import { mailConfig } from "../mailConfig";
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
    // AQUI ESTÁ A CORREÇÃO FINAL:
    // O remetente NÃO pode ser a variável de ambiente (pois ela contém o ID de login)
    // TEM QUE SER O SEU E-MAIL CADASTRADO:
    const senderEmail = "alugueldequadrasquadramarcada@gmail.com";

    const mailOptions = {
      to: mailPayload.email,
      // Formato bonito: "Nome <email>"
      from: `Quadra Marcada <${senderEmail}>`,
      subject: mailPayload.subject,
      text: `Quadra Marcada Informa`,
      html: mailPayload.content,
    };

    console.log(
      `[MAIL PROVIDER] Enviando DE: ${senderEmail} PARA: ${mailPayload.email}`
    );

    try {
      const info = await mailConfig.sendMail(mailOptions);
      console.log(`[MAIL PROVIDER] Sucesso! ID: ${info.messageId}`);
    } catch (err: any) {
      console.error("[MAIL PROVIDER] Erro no envio:", err);
      throw new SendMailError();
    }
  }
}
