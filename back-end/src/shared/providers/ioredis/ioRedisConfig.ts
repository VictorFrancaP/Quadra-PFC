// Importando ioredis para configuração
import IORedis from "ioredis";

// exportando configuração do ioredis
export const ioredisConfig = {
  host: process.env.REDIS_HOST_LOCAL,
  port: 6379,
  maxRetriesPerRequest: null,
};

// exportando conexão com o ioredis
export const ioredisConnection = new IORedis(ioredisConfig);
