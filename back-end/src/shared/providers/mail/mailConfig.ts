// Importando nodemailer e dotenv para a utilização de variaveis de ambiente
import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

// criando configuração do nodemailer para envio de e-mails
export const mailConfig = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_HOST,
    pass: process.env.MAIL_PASS,
  },
});
