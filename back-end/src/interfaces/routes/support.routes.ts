// Importando Router do express
import { Router } from "express";

// Importando middlewares
import { ensureRole } from "../middlewares/ensureRole";
import { ensureJoi } from "../middlewares/ensureJoi";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

// Importando schema validators
import { CreateSupportValidator } from "../validators/schema/support/CreateSupportValidator";
import { UpdateSupportValidator } from "../validators/schema/support/UpdateSupportValidator";
import { RequestParamsValidator } from "../validators/schema/RequestParamsValidator";

// Importando controllers
import { CreateSupportController } from "../controllers/support/CreateSupportController";
import { FindSupportUserController } from "../controllers/support/FindSupportUserController";
import { FindSupportsController } from "../controllers/support/FindSupportsController";
import { UpdateSupportController } from "../controllers/support/UpdateSupportController";

// criando variavel para instânciar o Router
const routes = Router();

// Instânciando controllers
const createSupportController = new CreateSupportController();
const findSupportUserController = new FindSupportUserController();
const findSupportsController = new FindSupportsController();
const updateSupportController = new UpdateSupportController();

// criando rotas

// post
routes.post(
  "/create",
  ensureAuthenticated,
  ensureJoi(CreateSupportValidator, "body"),
  createSupportController.handle
);

// get
routes.get("/find", ensureAuthenticated, findSupportUserController.handle);
routes.get(
  "/findAll",
  ensureAuthenticated,
  ensureAuthenticated,
  ensureRole("ADMIN"),
  findSupportsController.handle
);

// put
routes.put(
  "/update/:id",
  ensureAuthenticated,
  ensureRole("ADMIN"),
  ensureJoi(RequestParamsValidator, "params"),
  ensureJoi(UpdateSupportValidator, "body"),
  updateSupportController.handle
);

// exportando rota
export { routes as supportRoutes };
