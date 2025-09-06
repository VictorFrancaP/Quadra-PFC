// Importando Queue do bullmq para filas
import { Queue } from "bullmq";

// Importando conexão com ioredis para utilizar o bullmq
import { bullConnection } from "../bullConnection";

// exportando queue
export const dailyRemaiderQueue = new Queue("dailyRemaider", {
  connection: bullConnection,
});

// exportando job
export const dailyRemaiderJob = async () => {
  await dailyRemaiderQueue.add(
    "dailyRemaiderJob",
    { type: "dailyRemaider", sendDate: new Date().toISOString() },
    { repeat: { pattern: "0 9 * * *", tz: "America/Sao_Paulo" } }
  );
};
