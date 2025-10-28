// Importando Router do express
import { Router } from "express";

// Importando middlewares
import { ensureRole } from "../middlewares/ensureRole";
import { ensureJoi } from "../middlewares/ensureJoi";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

// Importando validators schema
import { RequestParamsValidator } from "../validators/schema/RequestParamsValidator";
import { CreateReservationValidator } from "../validators/schema/reservation/CreateReservationValidator";

// Importando controllers
import { CreateReservationController } from "../controllers/reservation/CreateReservationController";
import { CancelReservationController } from "../controllers/reservation/CancelReservationController";
import { FindReservationUserController } from "../controllers/reservation/FindReservationUserController";

// instânciando router
const routes = Router();

// instânciando controllers
const createReservationController = new CreateReservationController();
const cancelReservationController = new CancelReservationController();
const findReservationUserController = new FindReservationUserController();

// criando rotas

// post
routes.post(
  "/create/:id",
  ensureAuthenticated,
  ensureJoi(RequestParamsValidator, "params"),
  ensureJoi(CreateReservationValidator, "body"),
  createReservationController.handle
);

routes.get(
  "/findAll",
  ensureAuthenticated,
  findReservationUserController.handle
);

// delete
routes.delete(
  "/cancel/:id",
  ensureAuthenticated,
  ensureJoi(RequestParamsValidator, "params"),
  cancelReservationController.handle
);

// exportando rota
export { routes as reservationRoutes };
