// Importando Router do express para a manipulação de rotas
import { Router } from "express";

// Importando middlewares
import { ensureRole } from "../middlewares/ensureRole";
import { ensureJoi } from "../middlewares/ensureJoi";

// Importando schema validators
import { CreateUserRequestValidator } from "../validators/schema/user/CreateUserRequestValidator";
import { CreateUserValidator } from "../validators/schema/user/CreateUserValidator";
import { AuthUserValidator } from "../validators/schema/user/AuthUserValidator";

// Importando controllers dos usuários
import { CreateUserRequestController } from "../controllers/user/CreateUserRequestController";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { SocialUserLoginController } from "../controllers/user/SocialUserLoginController";
import { AuthUserController } from "../controllers/user/AuthUserController";

// importando passport para o login com google ou facebook
import passport from "passport";

// criando variavel para instânciar o Router
const routes = Router();

// Instânciando controllers de usuários
const createUserRequestController = new CreateUserRequestController();
const createUserController = new CreateUserController();
const socialUserLoginController = new SocialUserLoginController();
const authUserController = new AuthUserController();

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
routes.post(
  "/login",
  ensureJoi(AuthUserValidator, "body"),
  authUserController.handle
);

// get
routes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
routes.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  socialUserLoginController.handle
);

// exportando routes com as
export { routes as userRoutes };
