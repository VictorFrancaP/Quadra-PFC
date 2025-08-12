// Importando tipos de permissões do usuário no sistema
import { userPermissions } from "../../domain/entities/User";

// Importando Request, Response e next do express
import { Request, Response, NextFunction } from "express";

// criando tipo de permissões em um array para validação com spread operator e o metodo includes
type allPermissions = userPermissions;

// exportando middleware de validação de permissão do sistema
export const ensureRole = (...roles: allPermissions[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    // verificando se o usuário está autenticado no sistema com token
    if (!request.user) {
      return response.status(403).json({
        message: "Usuário não autenticado no sistema!",
      });
    }

    // pegando a role do usuário autenticado
    const userRole = request.user.role;

    // verificando se role faz parte das autorizadas para entrar em uma rota ou serviço especifico
    if (!roles.includes(userRole)) {
      return response.status(401).json({
        message:
          "Acesso negado. Você não tem permissão para acessar esta rota ou serviço!",
      });
    }

    // retornando para o proximo middleware ou função
    return next();
  };
};
