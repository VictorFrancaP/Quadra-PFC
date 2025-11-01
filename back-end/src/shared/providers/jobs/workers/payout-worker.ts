// Importando worker do bullmq para filas
import { Worker } from "bullmq";

// Importando ioredisconnection para conexão
import { ioredisConnection } from "../../ioredis/ioRedisConfig";

// Importando interfaces implementadas a serem instânciadas
import { FindReservationByIdRepository } from "../../../../infrastruture/repository/reservation/FindReservationByIdRepository";
import { FindSoccerByIdRepository } from "../../../../infrastruture/repository/soccer/FindSoccerByIdRepository";
import { FindUserByIdRepository } from "../../../../infrastruture/repository/user/FindUserByIdRepository";
import { PaymentProvider } from "../../payment/provider/PaymentProvider";
import { UpdateReservationRepository } from "../../../../infrastruture/repository/reservation/UpdateReservationRepository";

// Importando usecase
import { ProcessPayoutUseCase } from "../../../../application/usecases/payment/ProcessPayoutUseCase";

// criando worker
const worker = new Worker(
  "payout-queue",
  async (job) => {
    console.log("Iniciando payout worker...");
    // desestruturando dados
    const { reservationId } = job.data;

    // instâncias das interfaces implementadas
    const findReservationByIdRepository = new FindReservationByIdRepository();
    const findSoccerByIdRepository = new FindSoccerByIdRepository();
    const findUserByIdRepository = new FindUserByIdRepository();
    const paymentProvider = new PaymentProvider();
    const updateReservationRepository = new UpdateReservationRepository();

    // instânciando usecase
    const useCase = new ProcessPayoutUseCase(
      findUserByIdRepository,
      findSoccerByIdRepository,
      findReservationByIdRepository,
      paymentProvider,
      updateReservationRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ reservationId });
    } catch (err: any) {
      throw err;
    }
  },
  {
    connection: ioredisConnection,
  }
);
