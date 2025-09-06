// Importando função para pegar ano atual
import { yearNow } from "../dayjs/year/DayJsYearProvider";

// armazenando ano atual em uma variavel
const year = yearNow();

// exportando arrow function de template de e-mail
export const dailyRemaiderTemplate = (
  image: string,
  name: string,
  linkPlatform: string
) => {
  return `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; padding-bottom: 20px;">
      <img src=${image} alt="Logo Quadra Marcada" style="max-width: 150px;">
    </div>
    <div style="padding: 20px; border-top: 1px solid #eee;">
      <p style="color: #333333; font-size: 16px;">Olá, ${name}!</p>
      <p style="color: #333333; font-size: 16px; line-height: 1.5;">Este é um lembrete diário para você entrar na plataforma e verificar as reservas do seu espaço. É rápido, fácil e garante que você não perca nenhuma oportunidade.</p>
      <p style="color: #333333; font-size: 16px; line-height: 1.5;">Clique no botão abaixo para ir direto para sua área de gerenciamento e conferir as novidades. Mantenha sua agenda organizada e seus clientes satisfeitos!</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href=${linkPlatform} style="background-color: #ffc107; color: #333; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verificar Minhas Reservas</a>
      </p>
      <p style="color: #555555; font-size: 14px; margin-top: 40px;">Atenciosamente,</p>
      <p style="color: #555555; font-size: 14px;">Equipe de Suporte Quadra Marcada</p>
    </div>
    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; margin-top: 20px;">
      <p style="color: #aaaaaa; font-size: 12px;">© ${year} Quadra Marcada. Todos os direitos reservados.</p>
    </div>
  </div>
</body>`;
};
