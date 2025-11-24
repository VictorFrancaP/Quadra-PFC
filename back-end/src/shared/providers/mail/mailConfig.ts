import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("[MAIL CONFIG] Configurando transporte SMTP (Brevo)...");

export const mailConfig = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_HOST,
    pass: process.env.MAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

mailConfig.verify((error, success) => {
  if (error) {
    console.error("❌ [BREVO ERROR] Falha na conexão:", error);
  } else {
    console.log("✅ [BREVO SUCCESS] Conectado ao Brevo SMTP!");
  }
});
