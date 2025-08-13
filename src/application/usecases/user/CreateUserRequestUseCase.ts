// Importando interfaces a ser instânciadas na controller
import { IFindUserByEmailRepositories } from "../../../domain/repositories/user/IFindUserByEmailRepositories";
import { IResetTokenProvider } from "../../../shared/providers/tokens/crypto/IResetTokenProvider";
import { IRedisProvider } from "../../../shared/providers/redis/provider/IRedisProvider";
import { IMailProvider } from "../../../shared/providers/mail/provider/IMailProvider";

// Importando interface de dados
import { ICreateUserRequestDTO } from "../../dtos/user/ICreateUserRequestDTO";

// Importando error personalizado
import { UserFoundError } from "../../../shared/errors/UserFoundError";
import { LimitRatingSendMailError } from "../../../shared/errors/LimitRatingSendMailError";

// exportando classe de usecase
export class CreateUserRequestUseCase {
  constructor(
    private readonly findUserByEmailRepository: IFindUserByEmailRepositories,
    private readonly resetTokenProvider: IResetTokenProvider,
    private readonly redisProvider: IRedisProvider,
    private readonly mailProvider: IMailProvider
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

    // Conteúdo do e-mail
    const content = `<body style="margin:0;padding:0;background-color:#0b2b1f;font-family:Arial, Helvetica, sans-serif;color:#ffffff;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;margin:0 auto;background-color:#071b12;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:20px 24px 10px 24px;background:linear-gradient(90deg,#0f3b20,#08301a);text-align:center;">
          <!-- Cabeçalho / logo -->
          <img src="https://via.placeholder.com/120x60.png?text=TIME" alt="Logo do Time" width="120" height="60" style="display:block;margin:0 auto 12px auto;border:0;line-height:0;">
          <h1 style="margin:0;color:#ffd24a;font-size:22px;font-weight:700;letter-spacing:0.5px;">Confirme seu e-mail e entre em campo!</h1>
          <p style="margin:8px 0 0 0;color:#e6f3e9;font-size:14px;">Bem-vindo(a) ao <strong>Seu Time</strong> — a paixão pelo futebol começa aqui.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:26px 24px 20px 24px;background-image: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(0,0,0,0));">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding-bottom:16px;">
                <p style="margin:0;color:#d9f0da;font-size:16px;line-height:1.4;">
                  Olá <strong style="color:#fff;">${data.name}</strong>, precisamos confirmar seu e-mail para concluir o cadastro.
                </p>
              </td>
            </tr>
  
            <tr>
              <td style="padding-bottom:18px;">
                <p style="margin:0;color:#bfe9be;font-size:14px;line-height:1.5;">
                  Clique no botão abaixo para confirmar sua conta. O link expira em <strong>30 minutos</strong>.
                </p>
              </td>
            </tr>
  
            <tr>
              <td style="text-align:center;padding-bottom:20px;">
                <!-- Botão -->
                <a href=${linkConfirm} target="_blank" style="display:inline-block;padding:12px 22px;background:#ffd24a;color:#071b12;text-decoration:none;font-weight:700;border-radius:6px;border:2px solid rgba(0,0,0,0.08);box-shadow:0 4px 10px rgba(0,0,0,0.25);">
                  CONFIRMAR E-MAIL
                </a>
              </td>
            </tr>
  
            <tr>
              <td style="padding-bottom:14px;">
                <p style="margin:0;color:#bfe9be;font-size:13px;line-height:1.4;">
                  Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
                </p>
                <p style="word-break:break-all;margin:8px 0 0 0;color:#9fd6a3;font-size:12px;">
                  <a href=${linkConfirm} target="_blank" style="color:#9fd6a3;text-decoration:underline;">${linkConfirm}</a>
                </p>
              </td>
            </tr>
  
            <tr>
              <td style="padding-top:6px;">
                <hr style="border:none;height:1px;background:rgba(255,255,255,0.04);margin:10px 0;">
                <p style="margin:8px 0 0 0;color:#94c89a;font-size:12px;line-height:1.4;">
                  Caso você não tenha se cadastrado, ignore este e-mail e o link expirará automaticamente.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 18px;background:#052714;color:#cfead1;font-size:12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="vertical-align:middle;">
                <strong>Seu Time</strong><br>
                Rua do Estádio, 123 • Cidade • Estado
              </td>
              <td style="text-align:right;vertical-align:middle;">
                <a href="#" style="margin-left:8px;text-decoration:none;color:#cfead1;font-size:12px;">⚽</a>
                <a href="#" style="margin-left:8px;text-decoration:none;color:#cfead1;font-size:12px;">🏟️</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <div style="max-width:680px;margin:12px auto 0 auto;text-align:center;color:#9bd49c;font-size:12px;">
      <p style="margin:0;">Para suporte, responda este e-mail ou acesse o painel da sua conta.</p>
    </div>`;

    // Assunto do e-mail
    const subject = "Confirme o seu e-mail para continuar - Quadra Marcada";

    // Enviando e-mail via nodemailer
    await this.mailProvider.send({
      email: data.email,
      content,
      subject,
    });
  }
}
