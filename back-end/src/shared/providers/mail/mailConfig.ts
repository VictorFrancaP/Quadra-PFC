import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("[MAIL CONFIG] Configurando transporte Gmail (IPv4)...");

export const mailConfig = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // True para 465
  auth: {
    user: process.env.MAIL_USER || process.env.MAIL_HOST,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: "SSLv3",
  },
  // AQUI ESTÁ O SEGREDO DO RENDER (IPv4)
  family: 4,

  // Timeouts para evitar travamento
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
} as nodemailer.TransportOptions); // <--- ESSE 'as ...' CORRIGE O ERRO VERMELHO

// Verificação de conexão
mailConfig.verify((error, success) => {
  if (error) {
    console.error("❌ [MAIL ERROR] Erro fatal na conexão SMTP:", error);
  } else {
    console.log("✅ [MAIL SUCCESS] Conectado ao Gmail via IPv4!");
  }
});
