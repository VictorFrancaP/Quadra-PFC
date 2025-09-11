// Importando BeeQueue para utilização de filas
import BeeQueue from "bee-queue";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// exportando queue de e-mail
export const emailQueue = new BeeQueue("email-queue", {
  redis: process.env.REDIS_HOST,
});
