// Importando interfaces a ser instânciadas na controller
import { IFindUserByEmailRepositories } from "../../../domain/repositories/user/IFindUserByEmailRepositories";
import { IResetTokenProvider } from "../../../shared/providers/tokens/crypto/IResetTokenProvider";
import { IRedisProvider } from "../../../shared/providers/redis/provider/IRedisProvider";
import { IMailProvider } from "../../../shared/providers/mail/provider/IMailProvider";
import { IPictureConfig } from "../../../shared/providers/cloudinary/default-profile/IPictureConfig";

// Importando interface de dados
import { ICreateUserRequestDTO } from "../../dtos/user/ICreateUserRequestDTO";

// Importando error personalizado
import { UserFoundError } from "../../../shared/errors/UserFoundError";
import { LimitRatingSendMailError } from "../../../shared/errors/LimitRatingSendMailError";

// Importando template de e-mail
import { confirmEmailTemplate } from "../../../shared/providers/templates/confirmEmailTemplate";

// exportando classe de usecase
export class CreateUserRequestUseCase {
  constructor(
    private readonly findUserByEmailRepository: IFindUserByEmailRepositories,
    private readonly resetTokenProvider: IResetTokenProvider,
    private readonly redisProvider: IRedisProvider,
    private readonly mailProvider: IMailProvider,
    private readonly pictureConfig: IPictureConfig
  ) {}

  async execute(data: ICreateUserRequestDTO): Promise<void> {
    const userAlreadyExists =
      await this.findUserByEmailRepository.findUserByEmail(data.email);

    if (userAlreadyExists) {
      throw new UserFoundError("e-mail");
    }

    // definindo uma chave para o e-mail no redis, no caso se o usuário ficar fazendo requisições
    const limitRequest = `pending_user_limited_request:${data.email}`;

    // verifica o se e-mail já está alocado no cache (redis)
    const isLocked = await this.redisProvider.dataGet(limitRequest);

    // se estiver alocado, retorna um erro
    if (isLocked) {
      throw new LimitRatingSendMailError();
    }

    // gerando token com crypto do nodejs
    const token = await this.resetTokenProvider.generateToken();

    // Armazenando informações no cache (redis);
    await this.redisProvider.dataSet({
      key: `pending_user_created:${token}`,
      expiration: 900,
      values: { name: data.name, email: data.email, token },
    });

    await this.redisProvider.dataSet({
      key: limitRequest,
      expiration: 300,
      values: { value: "true" },
    });

    // Link para continuar cadastro
    const linkConfirm = `${this.mailProvider.linkConfirm}/${token}`;

    // Enviando e-mail via nodemailer
    await this.mailProvider.send({
      email: data.email,
      content: confirmEmailTemplate(
        data.name,
        linkConfirm,
        this.pictureConfig.logoMain
      ),
      subject: `Confirmação de e-mail`,
    });
  }
}
