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

// instânciando router
const routes = Router();

// instânciando controllers
const createReservationController = new CreateReservationController();
const cancelReservationController = new CancelReservationController();

// criando rotas

// post
routes.post(
  "/create/:soccerId",
  ensureAuthenticated,
  ensureJoi(RequestParamsValidator, "params"),
  ensureJoi(CreateReservationValidator, "body"),
  createReservationController.handle
);

// delete
routes.delete(
  "/cancel/:reservationId",
  ensureAuthenticated,
  ensureJoi(RequestParamsValidator, "params"),
  cancelReservationController.handle
);

// exportando rota
export { routes as reservationRoutes };
