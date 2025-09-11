// Importando emailQueue para processar o job
import { emailQueue } from "../queues/emailQueue";

// Importando template para e-mail
import { dailyRemaiderTemplate } from "../../templates/dailyRemaiderTemplate";

// Importando mailProvider para o envio de e-mail
import { MailProvider } from "../../mail/provider/MailProvider";

// Importando pictureConfig para carregar logo do sistema
import { PictureConfig } from "../../cloudinary/default-profile/PictureConfig";

// processando o job
emailQueue.process(async (job) => {
  // pegando valores do job a ser executado
  const { email, name } = job.data;

  // instânciando mailProvider e pictureConfig
  const mailProvider = new MailProvider();
  const pictureConfig = new PictureConfig();

  // enviando e-mail para o usuário proprietário
  await mailProvider.send({
    email,
    content: dailyRemaiderTemplate(
      pictureConfig.logoMain,
      name,
      mailProvider.linkPlatform
    ),
    subject: "Lembrete diário - Quadra Marcada",
  });

  // retornando status para desenvolvimento
  return { status: "OK" };
});
