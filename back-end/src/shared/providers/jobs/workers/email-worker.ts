// Importando worker do bullmq para execução do job (tarefa)
import { Worker } from "bullmq";

// Importando template para e-mail
import { dailyRemaiderTemplate } from "../../templates/dailyRemaiderTemplate";

// Importando mailProvider para o envio de e-mail
import { MailProvider } from "../../mail/provider/MailProvider";

// Importando pictureConfig para carregar logo do sistema
import { PictureConfig } from "../../cloudinary/default-profile/PictureConfig";

// Importando ioredisconnection para conexão
import { ioredisConnection } from "../../ioredis/ioRedisConfig";

// instânciando worker (tarefa a ser executada)
const worker = new Worker(
  "e-mail-queue",
  async (job) => {
    // desestruturando dados
    const { email, name } = job.data;

    // criando try/catch para capturar erros na execução
    try {
      // instânciando interfaces implementadas
      const mailProvider = new MailProvider();
      const pictureConfig = new PictureConfig();

      // executando envio de e-mail
      await mailProvider.send({
        email,
        content: dailyRemaiderTemplate(
          pictureConfig.logoMain,
          name,
          mailProvider.linkPlatform
        ),
        subject: "Lembrete diário - Quadra Marcada",
      });
    } catch (err: any) {
      throw err;
    }
  },
  {
    connection: ioredisConnection,
  }
);
