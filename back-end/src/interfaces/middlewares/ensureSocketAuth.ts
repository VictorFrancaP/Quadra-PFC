// Importando jwt para verificar o token de acesso
import jwt from "jsonwebtoken";

// Importando Socket do socket.io
import { Socket } from "socket.io";

// Importando tipo para a função next
import { ExtendedError } from "socket.io";

// Importando error personalizado
import { TokenNotFoundError } from "../../shared/errors/user-error/TokenNotFoundError";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// middleware para validar token em uma sessão do socket.io
export const ensureSocketAuth = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    // pegando token do usuário logado
    const token = socket.handshake.auth.token;

    // caso não tenha token retorna um erro
    if (!token) {
      return next(new TokenNotFoundError());
    }

    // verificando token e pegando dados do usuário
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,

      // mudar isto depois
      { ignoreExpiration: true }
    ) as { sub: string };

    // pegando id do usuário
    socket.data.userId = payload.sub;
    next();
  } catch (error: any) {
    next(new Error("Autenticação falhou."));
  }
};
