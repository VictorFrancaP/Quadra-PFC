// Importando Router do express
import { Router } from "express";

// Importando middlewares
import { ensureRole } from "../middlewares/ensureRole";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureHour } from "../middlewares/ensureHour";
import { ensureJoi } from "../middlewares/ensureJoi";

// Importando validators
import { CreateOwnerSoccerValidator } from "../validators/schema/soccer/CreateOwnerSoccerValidator";
import { RequestParamsValidator } from "../validators/schema/RequestParamsValidator";
import { UpdateSoccerOwnerValidator } from "../validators/schema/soccer/UpdateSoccerOwnerValidator";

// Importando controllers
import { CreateOwnerSoccerController } from "../controllers/soccer/CreateOwnerSoccerController";
import { FindSoccersController } from "../controllers/soccer/FindSoccersController";
import { DeleteSoccerByAdminController } from "../controllers/soccer/DeleteSoccerByAdminController";
import { DeleteSoccerByOwnerController } from "../controllers/soccer/DeleteSoccerByOwnerController";
import { UpdateSoccerOwnerController } from "../controllers/soccer/UpdateSoccerOwnerController";

// instância do Router
const routes = Router();

// instâncias das controllers
const createOwnerSoccerController = new CreateOwnerSoccerController();
const findSoccersController = new FindSoccersController();
const deleteSoccerByAdminController = new DeleteSoccerByAdminController();
const deleteSoccerByOwnerController = new DeleteSoccerByOwnerController();
const updateSoccerOwnerController = new UpdateSoccerOwnerController();

// post
routes.post(
  "/create",
  ensureAuthenticated,
  ensureRole("ADMIN", "OWNER"),
  ensureHour(CreateOwnerSoccerValidator),
  createOwnerSoccerController.handle
);

// get
routes.get("/findAll", ensureAuthenticated, findSoccersController.handle);

// delete
routes.delete(
  "/delete/:id",
  ensureAuthenticated,
  ensureRole("ADMIN"),
  ensureJoi(RequestParamsValidator, "params"),
  deleteSoccerByAdminController.handle
);
routes.delete(
  "/delete",
  ensureAuthenticated,
  ensureRole("OWNER"),
  deleteSoccerByOwnerController.handle
);

// put
routes.put(
  "/update",
  ensureAuthenticated,
  ensureRole("OWNER"),
  ensureJoi(UpdateSoccerOwnerValidator, "body"),
  updateSoccerOwnerController.handle
);

// exportando rotas
export { routes as soccerRoutes };
