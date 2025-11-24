import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("[MAIL CONFIG] Tentando conexão via Porta 587 com IPv4...");

export const mailConfig = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // <--- VOLTAMOS PARA 587 (Mais permeável em firewalls)
  secure: false, // <--- TEM QUE SER FALSE PARA 587
  auth: {
    user: process.env.MAIL_USER || process.env.MAIL_HOST,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Ignora erros de certificado
    ciphers: "SSLv3",
  },
  // --- A COMBINAÇÃO VENCEDORA ---
  family: 4, // Força IPv4 (Resolve o Timeout do Render)

  // Timeouts curtos para não travar o front-end por muito tempo se falhar
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
} as nodemailer.TransportOptions);

// Verificação no Startup
mailConfig.verify((error, success) => {
  if (error) {
    console.error("❌ [MAIL ERROR 587] Falha:", error);
  } else {
    console.log("✅ [MAIL SUCCESS] Conectado na porta 587 via IPv4!");
  }
});
