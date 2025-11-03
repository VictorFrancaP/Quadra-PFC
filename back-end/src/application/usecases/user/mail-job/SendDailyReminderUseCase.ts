// Importando interfaces a serem instânciadas na controller
import { IFindSoccerOwnerRepositories } from "../../../../domain/repositories/soccer/IFindSoccerOwnerRepositories";
import { IFindUserOwnersRepositories } from "../../../../domain/repositories/user/IFindUserOwnersRepositories";

// Importando emailQueue para criar job
import { emailQueue } from "../../../../shared/providers/jobs/queues/email-queue";

// exportando usecase
export class SendDailyReminderUseCase {
  constructor(
    private readonly findUserOwnersRepository: IFindUserOwnersRepositories,
    private readonly findSoccerOwnerRepository: IFindSoccerOwnerRepositories
  ) {}

  async execute(): Promise<void> {
    // procurando todos os proprietários na base de dados
    const usersOwners = await this.findUserOwnersRepository.findUserOwners();

    // caso não encontre nada, encerra o processo
    if (!usersOwners || usersOwners.length === 0) {
      return;
    }

    // pegando valores dos usuário de forma separada, dentro um loop
    for (const owner of usersOwners) {
      // verificando se owner tem uma quadra no sistema
      const ownerSoccer = await this.findSoccerOwnerRepository.findSoccerOwner(
        owner.id
      );

      // caso não tenha retorna um erro
      if (!ownerSoccer) {
        continue;
      }

      // verificando se a quadra está ativa
      if (ownerSoccer.isActive !== true) {
        continue;
      }

      // criando job com beequeue - emailqueue
      await emailQueue.add("send-mail", {
        email: owner.email,
        name: ownerSoccer.userName,
      });
    }
  }
}
