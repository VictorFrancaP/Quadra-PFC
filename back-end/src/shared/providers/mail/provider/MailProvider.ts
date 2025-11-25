// Importando interfaces a serem implementadas nesta classe
import { IMailProvider, IMailRequest } from "./IMailProvider";

// Importando configuração do nodemailer
import { mailConfig } from "../mailConfig";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Importando error personalizado
import { SendMailError } from "../../../errors/send-mail-error/SendMailError";

// exportando classe de implementação de interface
export class MailProvider implements IMailProvider {
  linkConfirm: string;
  linkResetPassword: string;
  linkPlatform: string;

  constructor() {
    this.linkConfirm = `${process.env.FRONT_HOST}/auth/user/cadastrar`;
    this.linkResetPassword = `${process.env.FRONT_HOST}/user/reset-password`;
    this.linkPlatform = `${process.env.FRONT_HOST}/minha-quadra/reservas`;
  }

  // enviando o e-mail
  async send(mailPayload: IMailRequest): Promise<void> {
    // remetente
    const senderEmail = "alugueldequadrasquadramarcada@gmail.com";

    // configurando opcões de e-mail
    const mailOptions = {
      to: mailPayload.email,
      from: `Quadra Marcada <${senderEmail}>`,
      subject: mailPayload.subject,
      text: `Quadra Marcada Informa`,
      html: mailPayload.content,
    };

    
    try {
      await mailConfig.sendMail(mailOptions);
    } catch (err: any) {
      throw new SendMailError();
    }
  }
}
