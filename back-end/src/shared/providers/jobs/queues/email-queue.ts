// Importando Queue do bullmq para filas
import { Queue } from "bullmq";

// Importando conexão com o ioredis
import { ioredisConnection } from "../../ioredis/ioRedisConfig";

// criando queue para e-mail
export const emailQueue = new Queue("e-mail-queue", {
  connection: ioredisConnection,
});
