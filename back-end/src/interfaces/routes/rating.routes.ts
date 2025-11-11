// Importando Router do express para a manipulação de rotas
import { Router } from "express";

// Importando middlewares
import { ensureRole } from "../middlewares/ensureRole";
import { ensureJoi } from "../middlewares/ensureJoi";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

// Importando validators
import { CreateRatingValidator } from "../validators/schema/rating/CreateRatingValidator";
import { RequestParamsRatingValidator } from "../validators/schema/rating/RequestParamsRatingValidator";

// Importando controllers
import { CreateRatingController } from "../controllers/rating/CreateRatingController";
import { FindSoccerAverageController } from "../controllers/rating/FindSoccerAverageController";
import { FindUserAverageController } from "../controllers/rating/FindUserAverageController";
import { FindRatingsSoccerController } from "../controllers/rating/FindRatingsSoccerController";

// criando variavel para instânciar o Router do express
const routes = Router();

// criando instância das controllers
const createRatingController = new CreateRatingController();
const findSoccerAverageController = new FindSoccerAverageController();
const findUserAverageController = new FindUserAverageController();
const findRatingsSoccerController = new FindRatingsSoccerController();

// criando rotas

// post
routes.post(
  "/create/soccer/:soccerId",
  ensureAuthenticated,
  ensureJoi(RequestParamsRatingValidator, "params"),
  ensureJoi(CreateRatingValidator, "body"),
  createRatingController.handle
);
routes.post(
  "/create/user/:ratedUserId",
  ensureAuthenticated,
  ensureRole("OWNER"),
  ensureJoi(RequestParamsRatingValidator, "params"),
  ensureJoi(CreateRatingValidator, "body"),
  createRatingController.handle
);

// get
routes.get(
  "/find/soccer/:soccerId",
  ensureAuthenticated,
  ensureJoi(RequestParamsRatingValidator, "params"),
  findSoccerAverageController.handle
);
routes.get(
  "/find/user/:ratedUserId",
  ensureAuthenticated,
  ensureJoi(RequestParamsRatingValidator, "params"),
  findUserAverageController.handle
);
routes.get(
  "/findAll/:soccerId",
  ensureAuthenticated,
  ensureJoi(RequestParamsRatingValidator, "params"),
  findRatingsSoccerController.handle
);

// exportando rotas
export { routes as ratingRoutes };
