import { Router } from "express";

// Importando middleware
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

// Importando controller a serem instânciadas
import { CreateRefreshTokenController } from "../controllers/refresh-token/CreateRefreshTokenController";

// criando rotas
const routes = Router();

// criando instâncias das controllers
const createRefreshTokenController = new CreateRefreshTokenController();

console.log("[LOG SERVER] Rotas de Refresh Token Carregadas");

// Rota POST na raiz do grupo (que já é /auth/refresh definido no server.ts)
routes.post("/", (req, res, next) => {
    console.log("[LOG SERVER] entrou na rota")
    return createRefreshTokenController.handle(req, res);
});

// exportando rotas
export { routes as refreshTokenRoutes };
