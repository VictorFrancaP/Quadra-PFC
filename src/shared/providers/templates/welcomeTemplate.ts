// Importando dayjs para manipulação de datas
import dayjs from "dayjs";

// exportando arrow function para templates de e-mails
export const welcomeTemplate = (name: string) => {
    // pegando ano atual com dayjs
    const yearNow = dayjs().year();

    // template do e-mail
    return `<body style="margin:0; padding:0; background-color:#F4F5F7;">
    <div style="display:none; font-size:1px; color:#F4F5F7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
      Sua conta foi criada com sucesso. Bem-vindo(a) ao sistema!
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F4F5F7; padding:24px 0;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px; background-color:#FFFFFF; border-radius:12px; overflow:hidden;">
            <tr>
              <td align="center" style="background-color:#0F172A; padding:28px 24px;">
                <h1 style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:28px; color:#FFFFFF; font-weight:700;">
                  Bem-vindo(a) ao Sistema
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:24px; font-family:Arial, Helvetica, sans-serif; color:#0F172A;">
                <p style="margin:0 0 12px 0; font-size:16px; line-height:24px;">
                  Olá, <strong>${name}</strong>!
                </p>
                <p style="margin:0 0 16px 0; font-size:16px; line-height:24px;">
                  Sua conta foi criada com sucesso. Estamos muito felizes em ter você conosco.
                </p>

                <hr style="border:none; border-top:1px solid #E2E8F0; margin:20px 0;">

                <p style="margin:0 0 8px 0; font-size:14px; line-height:22px; color:#334155;">
                  Dicas para começar:
                </p>
                <ul style="margin:0 0 12px 20px; padding:0; color:#334155;">
                  <li style="margin:0 0 8px 0; font-size:14px; line-height:20px;">Complete seu perfil e defina uma senha forte.</li>
                  <li style="margin:0 0 8px 0; font-size:14px; line-height:20px;">Ative a verificação em duas etapas (se disponível).</li>
                  <li style="margin:0 0 8px 0; font-size:14px; line-height:20px;">Explore os recursos no menu principal.</li>
                </ul>

                <p style="margin:12px 0 0 0; font-size:14px; line-height:22px; color:#334155;">
                  Precisa de ajuda? Responda este e-mail ou fale conosco pelo suporte.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="background-color:#F1F5F9; padding:16px 24px;">
                <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#64748B;">
                  Você recebeu este e-mail porque uma conta foi registrada com este endereço.
                  Se não foi você, ignore esta mensagem.
                </p>
                <p style="margin:8px 0 0 0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#94A3B8;">
                  © ${yearNow} — Quadra Marcada
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>`;
}