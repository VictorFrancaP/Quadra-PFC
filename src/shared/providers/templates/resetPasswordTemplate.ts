// Importando dayjs para a manipulação de datas
import dayjs from "dayjs";

// pegando ano atual com dayjs
const yearNow = dayjs().year();

// exportando arrow function de template
export const resetPasswordTemplate = (name: string, link?: string) => {
  return `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; padding-bottom: 20px;">
          <img src="https://via.placeholder.com/150x50?text=Seu+Logo" alt="Logo do Clube" style="max-width: 150px;">
      </div>
      <div style="padding: 20px; border-top: 1px solid #eee;">
          <p style="color: #333333; font-size: 16px;">Olá, ${name}!</p>
          <p style="color: #333333; font-size: 16px; line-height: 1.5;">Esta mensagem é para confirmar que a senha da sua conta foi alterada com sucesso.</p>
          <p style="color: #333333; font-size: 16px; line-height: 1.5;">Se você não realizou esta alteração, por favor, entre em contato com nosso suporte imediatamente para garantir a segurança da sua conta:</p>
          <p style="text-align: center; margin: 30px 0;">
              <a href="*****ADICIONAR****LINK*******" style="background-color: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Contatar o Suporte</a>
          </p>
          <p style="color: #555555; font-size: 14px; margin-top: 40px;">Atenciosamente,</p>
          <p style="color: #555555; font-size: 14px;">A Equipe Futebol Clube</p>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; margin-top: 20px;">
          <p style="color: #aaaaaa; font-size: 12px;">© ${yearNow} Quadra Marcada. Todos os direitos reservados.</p>
      </div>
  </div>
</body>`;
};
