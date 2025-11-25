// Importando nodemailer para envio de e-mails
import nodemailer from "nodemailer";

// Importando dotenv para utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// exportando configuração de envio de e-mail
export const mailConfig = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAIL_HOST,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: "SSLv3",
  },
  family: 4,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
} as nodemailer.TransportOptions);
