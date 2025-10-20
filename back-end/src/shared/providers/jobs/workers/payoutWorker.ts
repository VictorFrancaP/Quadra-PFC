// Importando queue do bee-queue
import { payoutQueue } from "../queues/payoutQueue";

// Importando interfaces implementadas a serem instânciadas
import { FindReservationByIdRepository } from "../../../../infrastruture/repository/reservation/FindReservationByIdRepository";
import { FindUserByIdRepository } from "../../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindSoccerByIdRepository } from "../../../../infrastruture/repository/soccer/FindSoccerByIdRepository";
import { PaymentProvider } from "../../payment/provider/PaymentProvider";
import { UpdateReservationRepository } from "../../../../infrastruture/repository/reservation/UpdateReservationRepository";

// Importando usecase
import { ProcessPayoutUseCase } from "../../../../application/usecases/payment/ProcessPayoutUseCase";

// criando processo para o job
payoutQueue.process(async (job) => {
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

  //   criando try/catch para capturar erros na execução
  try {
    await useCase.execute({ reservationId });
  } catch (err: any) {
    console.error(err.message);
  }
});
