// Importando dayJs para a manipulação de datas
import dayjs from "dayjs";

// pegando ano atual com dayJs
const yearNow = dayjs().year();

// exportando template para o envio de e-mail
export const requestResetPasswordTemplate = (
  name: string,
  linkResetPassword: string
) => {
  return `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; padding-bottom: 20px;">
          <img src="https://via.placeholder.com/150x50?text=Seu+Logo" alt="Logo do Clube" style="max-width: 150px;">
      </div>
      <div style="padding: 20px; border-top: 1px solid #eee;">
          <p style="color: #333333; font-size: 16px;">Olá, ${name}!</p>
          <p style="color: #333333; font-size: 16px; line-height: 1.5;">Recebemos uma solicitação para redefinir a senha da sua conta.</p>
          <p style="color: #333333; font-size: 16px; line-height: 1.5;">Para criar uma nova senha, clique no botão abaixo. Este link é válido por um tempo limitado para a sua segurança, então não perca tempo e garanta seu lugar em campo!</p>
          <p style="text-align: center; margin: 30px 0;">
              <a href=${linkResetPassword} style="background-color: #ffc107; color: #333; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
          </p>
          <p style="color: #333333; font-size: 16px; line-height: 1.5;">Se você não solicitou a alteração de senha, ignore este e-mail. Nenhuma alteração será feita na sua conta.</p>
          <p style="color: #555555; font-size: 14px; margin-top: 40px;">Atenciosamente,</p>
          <p style="color: #555555; font-size: 14px;">Equipe de Suporte Quadra Marcada</p>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; margin-top: 20px;">
          <p style="color: #aaaaaa; font-size: 12px;">© ${yearNow} Quadra Marcada. Todos os direitos reservados.</p>
      </div>
  </div>
</body>`;
};
