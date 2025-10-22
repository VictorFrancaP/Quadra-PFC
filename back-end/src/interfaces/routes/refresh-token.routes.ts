import { Router } from "express";

// Importando middleware
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

// Importando controller a serem instânciadas
import { CreateRefreshTokenController } from "../controllers/refresh-token/CreateRefreshTokenController";

// criando rotas
const routes = Router();

// criando instâncias das controllers
const createRefreshTokenController = new CreateRefreshTokenController();

// post
routes.post("/refresh", createRefreshTokenController.handle);

// exportando rotas
export { routes as refreshTokenRoutes };
