// Importando interface serem instânciadas na controller
import { IFindUserResetTokenRepositories } from "../../../../domain/repositories/user/IFindUserResetTokenRepositories";
import { IDayJsProvider } from "../../../../shared/providers/dayjs/IDayJsProvider";
import { ICompareProvider } from "../../../../shared/providers/bcrypt/compare/ICompareProvider";
import { IHashProvider } from "../../../../shared/providers/bcrypt/hash/IHashProvider";
import { IUpdateUserRepositories } from "../../../../domain/repositories/user/IUpdateUserRepositories";
import { IMailProvider } from "../../../../shared/providers/mail/provider/IMailProvider";
import { IPictureConfig } from "../../../../shared/providers/cloudinary/default-profile/IPictureConfig";

// Importando interface de dados
import { IResetPasswordUserDTO } from "../../../dtos/user/password-reset/IResetPasswordUserDTO";

// Importando error personalizado
import { TokenUserError } from "../../../../shared/errors/user-error/TokenUserError";
import { ExpiredTimeUserError } from "../../../../shared/errors/user-error/TokenUserError";
import { PasswordUserSameError } from "../../../../shared/errors/user-error/CredentialsUserError";

// Importando entidade User para atualização com o metodo estatico
import { User } from "../../../../domain/entities/User";

// Importando template para o envio de e-mail
import { resetPasswordTemplate } from "../../../../shared/providers/templates/resetPasswordTemplate";

// exportando usecase
export class ResetPasswordUserUseCase {
  constructor(
    private readonly findUserResetTokenRepository: IFindUserResetTokenRepositories,
    private readonly dayJsProvider: IDayJsProvider,
    private readonly compareProvider: ICompareProvider,
    private readonly hashProvider: IHashProvider,
    private readonly updateUserRepository: IUpdateUserRepositories,
    private readonly mailProvider: IMailProvider,
    private readonly pictureConfig: IPictureConfig
  ) {}

  async execute(data: IResetPasswordUserDTO): Promise<void> {
    // verificando token gerado pelo usuário
    const userTokenIsValid =
      await this.findUserResetTokenRepository.findUserToken(data.token);

    // se não retornar um usuário, retorna um erro
    if (!userTokenIsValid) {
      throw new TokenUserError();
    }

    // verificando se resetTokenExpired é nulo ou indefinido
    if (
      userTokenIsValid.resetTokenExpired === null ||
      userTokenIsValid.resetTokenExpired === undefined
    ) {
      throw new TokenUserError();
    }

    // verificando o tempo de expiração do token está valido ainda
    const userExpiredTimeToken = await this.dayJsProvider.verify(
      userTokenIsValid.resetTokenExpired
    );

    // se retornar true, retorna um um erro
    if (userExpiredTimeToken) {
      throw new ExpiredTimeUserError();
    }

    // verificando se senha atual é igual a anterior
    const matchPassword = await this.compareProvider.comparePassword(
      data.password,
      userTokenIsValid.password
    );

    // se entrar no if quer dizer que a senha é a mesma que a anterior
    if (matchPassword) {
      throw new PasswordUserSameError();
    }

    // criptogrando nova senha do usuário
    const newPasswordHash = await this.hashProvider.hashPassword(data.password);

    // atualizando informações do usuário
    const updates = User.updateUserInfos(userTokenIsValid, {
      password: newPasswordHash,
      resetToken: null,
      resetTokenExpired: null,
    });

    // mandando atualização para o banco de dados
    await this.updateUserRepository.updateUser(updates);

    // enviando e-mail relatando alteração de senha
    await this.mailProvider.send({
      email: userTokenIsValid.email,
      content: resetPasswordTemplate(
        userTokenIsValid.name,
        this.pictureConfig.logoMain
      ),
      subject: "Alteração de senha",
    });
  }
}
