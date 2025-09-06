// Importando interfaces a serem instânciadas na controller
import { IFindSoccerOwnerRepositories } from "../../../../domain/repositories/soccer/IFindSoccerOwnerRepositories";
import { IFindUserOwnersRepositories } from "../../../../domain/repositories/user/IFindUserOwnersRepositories";
import { IMailProvider } from "../../../../shared/providers/mail/provider/IMailProvider";
import { IPictureConfig } from "../../../../shared/providers/cloudinary/default-profile/IPictureConfig";

// Importando template de e-mail
import { dailyRemaiderTemplate } from "../../../../shared/providers/templates/dailyRemaiderTemplate";

// exportando usecase
export class SendDailyReminderUseCase {
  constructor(
    private readonly findUserOwnersRepository: IFindUserOwnersRepositories,
    private readonly findSoccerOwnerRepository: IFindSoccerOwnerRepositories,
    private readonly mailProvider: IMailProvider,
    private readonly pictureConfig: IPictureConfig
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
        console.log(`O proprietário não possui quadras na base de dados`);
        continue;
      }

      // verificando se a quadra está ativa
      if (ownerSoccer.isActive !== true) {
        console.log(`A quadra não está ativa`);
        continue;
      }

      // enviando e-mail pelo mailProvider
      await this.mailProvider.send({
        email: owner.email,
        content: dailyRemaiderTemplate(
          this.pictureConfig.logoMain,
          ownerSoccer.userName,
          this.mailProvider.linkPlatform
        ),
        subject: "Lembrete diário - Quadra Marcada",
      });
    }
  }
}
