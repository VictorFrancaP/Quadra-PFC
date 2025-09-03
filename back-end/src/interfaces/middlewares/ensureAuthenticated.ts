// Importando Request, Response e next do express
import { Request, Response, NextFunction } from "express";

// Importando jwt para verificação de token
import jwt, { JwtPayload } from "jsonwebtoken";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Tipos de permissões do usuário
import { userPermissions } from "../../domain/entities/User";

// interface de herança para o JWTPAYLOAD
interface decodedUserPayload extends JwtPayload {
  id: string;
  role: userPermissions;
}

// exportando middleware de validação de token
export const ensureAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // pegando valor do authorization
  const authHeader = request.headers.authorization;

  // verificando se não existe algum valor e se não está combinado com Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(403).json({
      message: "É preciso se logar para utilizar esta rota!",
    });
  }

  // pegando valor do token
  const token = authHeader.split(" ")[1];

  // criando try/catch para a captura de erros na execução
  try {
    // verificando se o token é valido
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET!
    ) as decodedUserPayload;

    // verificando se os valores id e role estão presentes no token
    if (!decoded.sub || !decoded.role) {
      return response.status(403).json({
        message: "Falha ao acessar os dados do usuário!",
      });
    }

    // armazenando id e role
    request.user = {
      id: decoded.sub as string,
      role: decoded.role,
    };

    // passando para o proximo middleware
    return next();
  } catch (err) {
    return response.status(401).json({
      message: "Token inválido ou expirado!",
    });
  }
};
