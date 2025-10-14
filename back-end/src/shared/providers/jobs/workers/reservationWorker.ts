// Importando queue do reservation
import { reservationQueue } from "../queues/reservationQueue";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindReservationByIdRepository } from "../../../../infrastruture/repository/reservation/FindReservationByIdRepository";
import { UpdateReservationRepository } from "../../../../infrastruture/repository/reservation/UpdateReservationRepository";

// Importando usecase a ser utilizada na worker
import { ExpiredReservationUseCase } from "../../../../application/usecases/reservation/ExpiredReservationUseCase";

// exportando worker
reservationQueue.process(async (job) => {
  // desestruturando dados
  const { reservationId, statusPayment } = job.data;

  // instânciando interfaces implementadas
  const findReservationByIdRepository = new FindReservationByIdRepository();
  const updateReservationRepository = new UpdateReservationRepository();

  // instânciando usecase
  const useCase = new ExpiredReservationUseCase(
    findReservationByIdRepository,
    updateReservationRepository
  );

  // criando try/catch para capturar erros na execução
  try {
    await useCase.execute({ reservationId, statusPayment });
  } catch (err: any) {
    console.error(err.message);
  }
});
