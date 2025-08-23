// Importando Router do express
import { Router } from "express";

// Importando middlewares
import { ensureRole } from "../middlewares/ensureRole";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureJoi } from "../middlewares/ensureJoi";

// Importando Validator para validação de dados
import { CreateSolicitationOwnerValidator } from "../validators/schema/solicitations/CreateSolicitationOwnerValidator";

// Importando controllers
import { CreateSolicitationOwnerController } from "../controllers/solicitations/CreateSolicitationOwnerController";

// instância do router
const routes = Router();

// criando instância das controllers
const createSolicitationOwnerController =
  new CreateSolicitationOwnerController();

// criando rotas

// post
routes.post(
  "/create",
  ensureAuthenticated,
  ensureJoi(CreateSolicitationOwnerValidator, "body"),
  createSolicitationOwnerController.handle
);

// exportando rotas
export { routes as solicitationOwnerRoutes };
