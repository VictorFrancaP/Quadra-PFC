// Importando cron para execução de um job diário
import cron from "node-cron";

// Importando interfaces implementadas a serem passadas na usecase
import { FindUserOwnersRepository } from "../../../../infrastruture/repository/user/FindUserOwnersRepository";
import { FindSoccerOwnerRepository } from "../../../../infrastruture/repository/soccer/FindSoccerOwnerRepository";
import { MailProvider } from "../../mail/provider/MailProvider";
import { PictureConfig } from "../../cloudinary/default-profile/PictureConfig";

// Importando usecase do envio de e-mail
import { SendDailyReminderUseCase } from "../../../../application/usecases/user/mail-job/SendDailyReminderUseCase";

// exportando arrow function do cron
export const startEmailCronJob = () => {
  cron.schedule(
    "0 9 * * *",
    async () => {
      // console para o desenvolvimento
      console.log("Iniciando envio de e-mail diário");

      // instâncias das interfaces implementadas
      const findUserOwnersRepository = new FindUserOwnersRepository();
      const findSoccerOwnerRepository = new FindSoccerOwnerRepository();
      const mailProvider = new MailProvider();
      const pictureConfig = new PictureConfig();

      // instância da usecase para execução da tarefa diária
      const useCase = new SendDailyReminderUseCase(
        findUserOwnersRepository,
        findSoccerOwnerRepository,
        mailProvider,
        pictureConfig
      );

      // executando usecase
      await useCase.execute();
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );
};
