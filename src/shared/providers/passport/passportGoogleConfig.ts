// Importando passport e estratégia especifica para o login com o google oauth20
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// exportando arrow function de dados do usuário google

export const passportConfig = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_SECRET_KEY as string,
        callbackURL: process.env.GOOGLE_URL_CALLBACK as string,
      },
      async (accessToken, refreshToken, profile, done) => {
        // criando try/catch para a captura de erros na execução
        try {
          // extraindo dados do usuário
          const userProfile = {
            name: profile.displayName,
            email: profile.emails![0]?.value,
            profileImage: profile.photos![0]?.value,
          };

          // se der certo, retorna o usuário
          done(null, userProfile);
        } catch (err) {
          done(err, false);
        }
      }
    )
  );
};
