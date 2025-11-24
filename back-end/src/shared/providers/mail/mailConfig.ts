import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("[MAIL CONFIG] Iniciando configuração...");

export const mailConfig = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // <--- MUDANÇA AQUI: Porta padrão para TLS
  secure: false, // <--- MUDANÇA AQUI: False para porta 587 (inicia inseguro e faz upgrade)
  auth: {
    user: process.env.MAIL_HOST,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Ajuda a evitar erros de certificado
  },
  // Timeouts para evitar o carregamento infinito
  connectionTimeout: 10000, // 10 segundos
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

mailConfig.verify((error, success) => {
  if (error) {
    console.error("❌ [MAIL ERROR] Falha na conexão com Gmail:", error);
  } else {
    console.log("✅ [MAIL SUCCESS] Conectado via Porta 587!");
  }
});
