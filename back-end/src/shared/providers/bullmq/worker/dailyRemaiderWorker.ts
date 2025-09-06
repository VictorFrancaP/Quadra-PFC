// Importando worker do bullmq para filas
import { Worker } from "bullmq";

// Importando conexão com o ioredis para utilizar o bullmq
import { bullConnection } from "../bullConnection";

// Importando interface implementadas a serem instânciadas
import { FindUserOwnersRepository } from "../../../../infrastruture/repository/user/FindUserOwnersRepository";
import { FindSoccerOwnerRepository } from "../../../../infrastruture/repository/soccer/FindSoccerOwnerRepository";
import { MailProvider } from "../../mail/provider/MailProvider";
import { PictureConfig } from "../../cloudinary/default-profile/PictureConfig";

// Importando usecase
import { SendDailyReminderUseCase } from "../../../../application/usecases/user/mail-job/SendDailyReminderUseCase";

// exportando worker
export const dailyRemaiderWorker = new Worker(
  "dailyRemaider",
  async () => {
    // instâncias das interfaces implementadas
    const findUserOwnersRepository = new FindUserOwnersRepository();
    const findSoccerOwnerRepository = new FindSoccerOwnerRepository();
    const mailProvider = new MailProvider();
    const pictureConfig = new PictureConfig();

    // criando try/catch para captura de erros na execução
    try {
      // criando instância da usecase
      const useCase = new SendDailyReminderUseCase(
        findUserOwnersRepository,
        findSoccerOwnerRepository,
        mailProvider,
        pictureConfig
      );

      // chamando usecase
      await useCase.execute();
    } catch (err: any) {
      console.log(
        `Erro ao enviar os lembretes ao usuários PROPRIETÁRIOS - ${err.message}`
      );
    }
  },
  // conexão com o bullmq
  { connection: bullConnection, concurrency: 1 }
);
