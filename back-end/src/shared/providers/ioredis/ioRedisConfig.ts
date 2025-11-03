// Importando ioredis para configuração
import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL as string;

// exportando conexão com o ioredis
export const ioredisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});
