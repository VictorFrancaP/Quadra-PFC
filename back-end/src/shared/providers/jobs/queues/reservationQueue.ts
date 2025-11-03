// Importando Queue do bullmq para filas
import { Queue } from "bullmq";

// Importando conexão com o ioredis
import { ioredisConnection } from "../../ioredis/ioRedisConfig";

// criando queue para e-mail
export const reservationQueue = new Queue("reservation-queue", {
  connection: ioredisConnection,
});
