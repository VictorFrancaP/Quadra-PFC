import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("[MAIL CONFIG] Configurando Brevo SMTP (Porta 2525 / IPv4)...");

export const mailConfig = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  // Porta 2525 é ótima para evitar bloqueios de provedores de nuvem
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAIL_HOST, // Seu email do Brevo
    pass: process.env.MAIL_PASS, // Sua chave SMTP
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: "SSLv3",
  },
  // --- A CORREÇÃO VITAL ---
  family: 4, // Força IPv4 (Sem isso, o Render tenta IPv6 e trava)

  // Timeouts
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
} as nodemailer.TransportOptions);

mailConfig.verify((error, success) => {
  if (error) {
    console.error("❌ [BREVO ERROR] Falha na conexão:", error);
  } else {
    console.log("✅ [BREVO SUCCESS] Conectado na porta 2525 via IPv4!");
  }
});
