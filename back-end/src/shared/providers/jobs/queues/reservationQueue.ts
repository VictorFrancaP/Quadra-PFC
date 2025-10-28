// Importando BeeQueue para utilização de filas
import BeeQueue from "bee-queue";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// pegando host do redis no .env
const redisConfig = {
  host: process.env.REDIS_HOST_LOCAL,
  port: Number(process.env.REDIS_PORT) || 6379,
};

// exportando queue de e-mail
export const reservationQueue = new BeeQueue("reservation-queue", {
  redis: redisConfig,
  isWorker: false,
});
