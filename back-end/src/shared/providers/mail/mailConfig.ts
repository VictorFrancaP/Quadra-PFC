import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// LOG DE DEBUG: Vamos ver se as credenciais estão carregando
console.log("[MAIL CONFIG] Configurando transporte...");
console.log(
  "[MAIL CONFIG] User:",
  process.env.MAIL_USER || process.env.MAIL_HOST
);
console.log(
  "[MAIL CONFIG] Pass (tamanho):",
  process.env.MAIL_PASS ? process.env.MAIL_PASS.length : 0
);

export const mailConfig = nodemailer.createTransport({
  // IMPORTANTE: Escreva o host explicitamente (sem process.env)
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // True para porta 465
  auth: {
    // Tenta as duas variações de nome para garantir
    user: process.env.MAIL_USER || process.env.MAIL_HOST,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verifica a conexão IMEDIATAMENTE ao iniciar
mailConfig.verify((error, success) => {
  if (error) {
    console.error("❌ [MAIL ERROR] Falha na conexão com SMTP:", error);
  } else {
    console.log("✅ [MAIL SUCCESS] Conectado ao Gmail com sucesso!");
  }
});
