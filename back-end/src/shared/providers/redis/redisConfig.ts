// Importando client do redis
import { createClient } from "redis";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Criando e exportando configuração com o redis
export const redisConfig = createClient({
  url: process.env.REDIS_URL,
});

// Verificando se acontece algum erro na execução
redisConfig.on("error", (err: any) => {
  console.error("Erro ao iniciar redis ", err.message);
});

// Conectando redis
(async () => {
  await redisConfig.connect();
})();
