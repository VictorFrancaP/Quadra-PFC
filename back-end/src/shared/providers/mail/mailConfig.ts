// Importando nodemailer e dotenv para a utilização de variaveis de ambiente
import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

// criando configuração do nodemailer para envio de e-mails
export const mailConfig = nodemailer.createTransport({
  service: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_HOST,
    pass: process.env.MAIL_PASS,
  },
  logger: true,
  debug: true,
});
