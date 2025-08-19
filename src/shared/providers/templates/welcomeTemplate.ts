// Importando dayjs para manipulação de datas
import dayjs from "dayjs";

// pegando ano atual com dayjs (criar função para isto - utilizando muito codigo repetitivo)
const yearNow = dayjs().year();

// exportando arrow function para templates de e-mails
export const welcomeTemplate = (name: string) => {
  // template do e-mail
  return `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
            <img src="https://via.placeholder.com/150x50?text=Seu+Logo" alt="Logo do Clube" style="max-width: 150px;">
        </div>
        <div style="padding: 20px; border-top: 1px solid #eee;">
            <p style="color: #333333; font-size: 16px;">Olá, ${name}!</p>
            <p style="color: #333333; font-size: 16px; line-height: 1.5;">Bem-vindo à nossa comunidade de apaixonados por futebol! Estamos muito felizes em tê-lo conosco. Prepare-se para acompanhar notícias exclusivas, resultados de jogos e muito mais.</p>
            <p style="color: #333333; font-size: 16px; line-height: 1.5;">Para começar, clique no botão abaixo e explore todas as funcionalidades do nosso sistema:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="*******ADICIONAR LINK DA HOME*******" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Acessar o Sistema</a>
            </p>
            <p style="color: #555555; font-size: 14px; margin-top: 40px;">Um abraço do time,</p>
            <p style="color: #555555; font-size: 14px;">Equipe Quadra Marcada</p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; margin-top: 20px;">
            <p style="color: #aaaaaa; font-size: 12px;">© ${yearNow} Quadra Marcada. Todos os direitos reservados.</p>
        </div>
    </div>
</body>`;
};
