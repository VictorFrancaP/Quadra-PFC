// Importando cron para execução de um job diário
import cron from "node-cron";

// Importando interfaces implementadas a serem passadas na usecase
import { FindUserOwnersRepository } from "../../../../infrastruture/repository/user/FindUserOwnersRepository";
import { FindSoccerOwnerRepository } from "../../../../infrastruture/repository/soccer/FindSoccerOwnerRepository";

// Importando usecase do envio de e-mail
import { SendDailyReminderUseCase } from "../../../../application/usecases/user/mail-job/SendDailyReminderUseCase";

// variavel para guardar tarefa
let emailJobTask: any = null;

// exportando arrow function do cron
export const startEmailCronJob = () => {
  // verificando se a tarefa já existe
  if (emailJobTask) {
    emailJobTask.stop();
    console.log("Parando e-mail worker...");
  }
  emailJobTask = cron.schedule(
    "35 8 * * *",
    async () => {
      // console para o desenvolvimento
      console.log("Iniciando tarefa de enfileiramento de e-mails diários.");

      // instâncias das interfaces implementadas
      const findUserOwnersRepository = new FindUserOwnersRepository();
      const findSoccerOwnerRepository = new FindSoccerOwnerRepository();

      // instância da usecase para execução da tarefa diária
      const useCase = new SendDailyReminderUseCase(
        findUserOwnersRepository,
        findSoccerOwnerRepository
      );

      // executando usecase
      await useCase.execute();
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );
};
