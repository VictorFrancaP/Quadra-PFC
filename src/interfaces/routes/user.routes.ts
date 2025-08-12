// Importando Router do express para a manipulação de rotas
import { Router } from "express";

// Importando middlewares
import { ensureRole } from "../middlewares/ensureRole";
import { ensureJoi } from "../middlewares/ensureJoi";

// Importando schema validators
import { CreateUserRequestValidator } from "../validators/schema/user/CreateUserRequestValidator";

// Importando controllers dos usuários
import { CreateUserRequestController } from "../controllers/user/CreateUserRequestController";

// criando variavel para instânciar o Router
const routes = Router();

// Instânciando controllers de usuários
const createUserRequestController = new CreateUserRequestController();

// criando rotas

// post
routes.post(
  "/create",
  ensureJoi(CreateUserRequestValidator, "body"),
  createUserRequestController.handle
);

// exportando routes com as
export { routes as userRoutes };
