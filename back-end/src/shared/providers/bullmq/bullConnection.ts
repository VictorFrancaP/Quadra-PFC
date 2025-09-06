// Importando ioredis para usar o bullmq
import { Redis } from "ioredis";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// exportando variavel com conexão com ioredis
export const bullConnection = new Redis({
  host: process.env.IOREDIS_HOST,
  port: Number(process.env.IOREDIS_PORT),
  password: process.env.IOREDIS_PASS,
  maxRetriesPerRequest: null,
});
