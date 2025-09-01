// Importando Router do express
import { Router } from "express";

// Importando middlewares
import { ensureRole } from "../middlewares/ensureRole";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureHour } from "../middlewares/ensureHour";

// Importando validators
import { CreateOwnerSoccerValidator } from "../validators/schema/soccer/CreateOwnerSoccerValidator";

// Importando controllers
import { CreateOwnerSoccerController } from "../controllers/soccer/CreateOwnerSoccerController";

// instância do Router
const routes = Router();

// instâncias das controllers
const createOwnerSoccerController = new CreateOwnerSoccerController();

// post
routes.post(
  "/create",
  ensureAuthenticated,
  ensureRole("ADMIN", "OWNER"),
  ensureHour(CreateOwnerSoccerValidator),
  createOwnerSoccerController.handle
);

// exportando rotas
export { routes as soccerRoutes };
