// Importando interface a ser instãnciada na controller
import { IFindUserByEmailRepositories } from "../../../../domain/repositories/user/IFindUserByEmailRepositories";
import { ILockUserAccountRepositories } from "../../../../domain/repositories/user/ILockUserAccountRepositories";
import { IResetTokenProvider } from "../../../../shared/providers/tokens/crypto/IResetTokenProvider";
import { IDayJsProvider } from "../../../../shared/providers/dayjs/IDayJsProvider";
import { IMailProvider } from "../../../../shared/providers/mail/provider/IMailProvider";
import { IUpdateUserRepositories } from "../../../../domain/repositories/user/IUpdateUserRepositories";
import { IPictureConfig } from "../../../../shared/providers/cloudinary/default-profile/IPictureConfig";

// Importando entidade User para utilização do metodo estatico de update
import { User } from "../../../../domain/entities/User";

// Importando interface de dados
import { IRequestUserResetPasswordDTO } from "../../../dtos/user/password-reset/IRequestUserResetPasswordDTO";

// Importando template para o envio de e-mail
import { requestResetPasswordTemplate } from "../../../../shared/providers/templates/requestResetPasswordTemplate";

// Importando error personalizado
import { SendMailUserNotFoundError } from "../../../../shared/errors/send-mail-error/SendMailUserNotFoundError";
import { AccountUserIsLockedError } from "../../../../shared/errors/user-error/AccountUserIsLockedError";
import { AccountUserIsBlockError } from "../../../../shared/errors/user-error/AccountUserIsLockedError";

// exportando classe de usecase
export class RequestUserResetPasswordUseCase {
  constructor(
    private readonly findUserByEmaiRepository: IFindUserByEmailRepositories,
    private readonly lockUserAccountRepository: ILockUserAccountRepositories,
    private readonly dayJsProvider: IDayJsProvider,
    private readonly mailProvider: IMailProvider,
    private readonly resetTokenProvider: IResetTokenProvider,
    private readonly updateUserRepository: IUpdateUserRepositories,
    private readonly pictureConfig: IPictureConfig
  ) {}

  async execute(data: IRequestUserResetPasswordDTO): Promise<void> {
    // verificando se usuário existe no banco de dados, por meio do e-mail
    const userAlreadyExists =
      await this.findUserByEmaiRepository.findUserByEmail(data.email);

    // se usuário não existir na base de dados, retorna um erro
    if (!userAlreadyExists) {
      throw new SendMailUserNotFoundError();
    }

    // verificando se a conta não está bloqueada permanentemente
    if (userAlreadyExists.accountBlock !== false) {
      throw new AccountUserIsBlockError();
    }

    // verifica se a conta do usuário não está bloqueada
    const userIsLocked =
      await this.lockUserAccountRepository.isLockedUserAccount(
        userAlreadyExists
      );

    // se o usuário estiver bloqueado retorna um erro
    if (userIsLocked) {
      throw new AccountUserIsLockedError();
    }

    // verifica se usuário já fez uma requisição recentemente para trocar de senha
    if (
      userAlreadyExists.resetTokenExpired !== null &&
      userAlreadyExists.resetTokenExpired !== undefined
    ) {
      // verifica se resetTokenExpired é valido ainda
      const validResetTokenExpired = await this.dayJsProvider.verify(
        userAlreadyExists.resetTokenExpired
      );

      // se estiver no tempo ainda, envia com o mesmo resetToken
      if (!validResetTokenExpired) {
        // criando link para resetar a senha do usuário com o token
        const linkResetPassword = `${this.mailProvider.linkResetPassword}/${userAlreadyExists.resetToken}`;

        // enviando e-mail com o mesmo token
        await this.mailProvider.send({
          email: data.email,
          content: requestResetPasswordTemplate(
            userAlreadyExists.name,
            linkResetPassword,
            this.pictureConfig.logoMain
          ),
          subject: "Redefinição de senha",
        });

        // encerrando fluxo de execução com o return
        return;
      }
    }

    // criando token caso o usuário não tenha
    const resetToken = await this.resetTokenProvider.generateToken();

    // criando tempo para a mudança de senha
    const resetTokenExpired = await this.dayJsProvider.add(30, "minute");

    // mandando atualização para a entidade User
    const updates = User.updateUserInfos(userAlreadyExists, {
      resetToken: resetToken,
      resetTokenExpired: resetTokenExpired,
    });

    // mandando atualização para o banco de dados
    await this.updateUserRepository.updateUser(updates);

    // criando link para redefinir a senha do usuário
    const linkResetPassword = `${this.mailProvider.linkResetPassword}/${resetToken}`;

    // enviando e-mail ao usuário
    await this.mailProvider.send({
      email: data.email,
      content: requestResetPasswordTemplate(
        userAlreadyExists.name,
        linkResetPassword,
        this.pictureConfig.logoMain
      ),
      subject: "Redefinição de senha",
    });
  }
}
