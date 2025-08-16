import { Router } from "express";

// Importando middleware
import { ensureRole } from "../middlewares/ensureRole";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureJoi } from "../middlewares/ensureJoi";

// Importando controller a serem instânciadas
import { CreateRefreshTokenController } from "../controllers/refresh-token/CreateRefreshTokenController";

// Importando schema de validação de dados
import { RequestParamsValidator } from "../validators/schema/RequestParamsValidator";

// criando rotas
const routes = Router();

// criando instâncias das controllers
const createRefreshTokenController = new CreateRefreshTokenController();

// post
routes.post(
  "/refresh",
  ensureAuthenticated,
  createRefreshTokenController.handle
);

// exportando rotas
export { routes as refreshTokenRoutes };
