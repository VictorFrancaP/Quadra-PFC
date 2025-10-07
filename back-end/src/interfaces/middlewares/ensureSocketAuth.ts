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
  console.log("\n--- [NOVA TENTATIVA DE CONEXÃO] ---");

  try {
    const token = socket.handshake.auth.token;
    console.log("Token recebido do cliente:", token ? "Sim" : "Não");

    if (!token) {
      return next(new Error("Token de autenticação não fornecido."));
    }

    // Vamos inspecionar o token ANTES de o verificar
    const decoded_sem_verificar = jwt.decode(token);
    console.log(
      "Conteúdo do token (sem verificar assinatura):",
      decoded_sem_verificar
    );

    const secret = process.env.JWT_SECRET;
    console.log(
      "JWT_SECRET sendo usada:",
      secret ? `Encontrada (tamanho: ${secret.length})` : "NÃO ENCONTRADA!"
    );

    // CORREÇÃO: Ajustado o tipo para esperar 'sub' em vez de 'id'.
    const payload = jwt.verify(
      token,
      secret as string,
      // Vamos manter a opção para ignorar a expiração por agora
      { ignoreExpiration: true }
    ) as { sub: string };

    console.log("Token verificado com sucesso! Payload:", payload);

    // CORREÇÃO: Usando 'payload.sub' para extrair o ID do usuário.
    socket.data.userId = payload.sub;
    next();
  } catch (error: any) {
    // ESTE É O LOG MAIS IMPORTANTE
    console.error("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    console.error("ERRO FINAL NA AUTENTICAÇÃO DO SOCKET:");
    console.error("  - Mensagem do Erro:", error.message);
    console.error("  - Nome do Erro:", error.name);
    console.error("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    next(new Error("Autenticação falhou."));
  }
};
