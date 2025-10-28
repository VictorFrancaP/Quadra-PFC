// src/shared/providers/jobs/workers/payoutWorker.ts

import BeeQueue from "bee-queue"; // Importe BeeQueue aqui
import dotenv from "dotenv";
dotenv.config();

// pegando host do redis no .env
const redisConfig = {
  host: process.env.REDIS_HOST_LOCAL,
  port: Number(process.env.REDIS_PORT) || 6379,
};

const payoutWorkerQueue = new BeeQueue("payout-queue", {
    redis: redisConfig,
    isWorker: true,
});

// Importando interfaces implementadas a serem instânciadas
import { FindReservationByIdRepository } from "../../../../infrastruture/repository/reservation/FindReservationByIdRepository";
import { FindUserByIdRepository } from "../../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerByIdRepository } from "../../../../infrastruture/repository/soccer/FindSoccerByIdRepository";
import { PaymentProvider } from "../../payment/provider/PaymentProvider";
import { UpdateReservationRepository } from "../../../../infrastruture/repository/reservation/UpdateReservationRepository";

// Importando usecase
import { ProcessPayoutUseCase } from "../../../../application/usecases/payment/ProcessPayoutUseCase";

// criando processo para o job
payoutWorkerQueue.process(async (job) => {
    console.log(`[Worker Payout] Processando job ID: ${job.id}`);
    
    // dados esperados
    const { reservationId } = job.data;

    // instânciando interfaces implementadas
    const findReservationByIdRepository = new FindReservationByIdRepository();
    const findUserByIdRepository = new FindUserByIdRepository();
    const findSoccerByIdRepository = new FindSoccerByIdRepository();
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

    //   criando try/catch para capturar erros na execução
    try {
        await useCase.execute({ reservationId });
        console.log(`[Worker Payout] Sucesso ao processar Payout para Reserva: ${reservationId}`);
    } catch (err: any) {
        console.error(`[Worker Payout] ERRO CRÍTICO para Reserva ${reservationId}:`, err.message);
        // Opcional: Re-lançar o erro para que o Bee-Queue tente novamente
        throw err;
    }
});