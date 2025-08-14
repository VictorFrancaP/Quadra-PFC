// Importando Router do express para a manipulação de rotas
import { Router } from "express";

// Importando middlewares
import { ensureRole } from "../middlewares/ensureRole";
import { ensureJoi } from "../middlewares/ensureJoi";

// Importando schema validators
import { CreateUserRequestValidator } from "../validators/schema/user/CreateUserRequestValidator";
import { CreateUserValidator } from "../validators/schema/user/CreateUserValidator";

// Importando controllers dos usuários
import { CreateUserRequestController } from "../controllers/user/CreateUserRequestController";
import { CreateUserController } from "../controllers/user/CreateUserController";

// criando variavel para instânciar o Router
const routes = Router();

// Instânciando controllers de usuários
const createUserRequestController = new CreateUserRequestController();
const createUserController = new CreateUserController();

// criando rotas

// post
routes.post(
  "/create",
  ensureJoi(CreateUserRequestValidator, "body"),
  createUserRequestController.handle
);
routes.post(
  "/create-account/:token",
  ensureJoi(CreateUserValidator, "body"),
  createUserController.handle
);

// exportando routes com as
export { routes as userRoutes };
