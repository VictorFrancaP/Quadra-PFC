// Importando arrow function para ano atual
import { yearNow } from "../dayjs/year/DayJsYearProvider";

// ano atual
const year = yearNow();

// exportando arrow function para template de confirmação de e-mail
export const confirmEmailTemplate = (
  name: string,
  link: string,
  image: string
) => {
  return `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; padding-bottom: 20px;">
          <img src=${image} alt="Logo Quadra Marcada" style="max-width: 150px;">
      </div>
      <div style="padding: 20px; border-top: 1px solid #eee;">
          <p style="color: #333333; font-size: 16px;">Olá, ${name}!</p>
          <p style="color: #333333; font-size: 16px; line-height: 1.5;">Obrigado por se cadastrar em nosso serviço de aluguel de quadras. Para completar sua inscrição, por favor, clique no botão abaixo para confirmar seu endereço de e-mail.</p>
          <p style="text-align: center; margin: 30px 0;">
              <a href=${link} style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Confirmar E-mail</a>
          </p>
          <p style="color: #333333; font-size: 16px; line-height: 1.5;">Se o botão não funcionar, você pode copiar e colar o link a seguir no seu navegador:</p>
          <p style="font-size: 14px; color: #666666; word-wrap: break-word;"><a href=${link} style="color: #4CAF50;">Link</a></p>
          <p style="color: #555555; font-size: 14px; margin-top: 40px;">Atenciosamente,</p>
          <p style="color: #555555; font-size: 14px;">Equipe de Suporte Quadra Marcada</p>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; margin-top: 20px;">
          <p style="color: #aaaaaa; font-size: 12px;">© ${year} Quadra Marcada. Todos os direitos reservados.</p>
      </div>
  </div>
</body>`;
};
