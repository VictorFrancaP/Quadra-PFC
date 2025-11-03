// Importtando worker do bullmq
import { Worker } from "bullmq";

// Importando conexão com ioredis
import { ioredisConnection } from "../../ioredis/ioRedisConfig";

// Importando interface implementadas
import { FindReservationByIdRepository } from "../../../../infrastruture/repository/reservation/FindReservationByIdRepository";
import { UpdateReservationRepository } from "../../../../infrastruture/repository/reservation/UpdateReservationRepository";

// Importando usecase
import { ExpiredReservationUseCase } from "../../../../application/usecases/reservation/ExpiredReservationUseCase";

// criando worker
const worker = new Worker(
  "reservation-queue",
  async (job) => {
    console.log("Iniciando reservation worker...");
    // desestruturando dados
    const { reservationId, expectedStatus } = job.data;

    // criando try/catch para capturar erros na execução
    try {
      // instânciando interfaces implementadas
      const findReservationByIdRepository = new FindReservationByIdRepository();
      const updateReservationRepository = new UpdateReservationRepository();

      // instânciando usecase
      const useCase = new ExpiredReservationUseCase(
        findReservationByIdRepository,
        updateReservationRepository
      );

      // executando usecase
      await useCase.execute({ reservationId, expectedStatus });
    } catch (err: any) {
      throw err;
    }
  },
  {
    connection: ioredisConnection,
  }
);
