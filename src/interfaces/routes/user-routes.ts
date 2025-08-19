// Importando Router do express para a manipulação de rotas
import { Router } from "express";

// Importando middlewares
import { ensureRole } from "../middlewares/ensureRole";
import { ensureJoi } from "../middlewares/ensureJoi";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

// Importando schema validators
import { CreateUserRequestValidator } from "../validators/schema/user/CreateUserRequestValidator";
import { CreateUserValidator } from "../validators/schema/user/CreateUserValidator";
import { AuthUserValidator } from "../validators/schema/user/AuthUserValidator";
import { RequestUserResetPasswordValidator } from "../validators/schema/user/RequestUserResetPasswordValidator";
import { ResetPasswordUserValidator } from "../validators/schema/user/ResetPasswordUserValidator";
import { ResetPasswordUserValidatorParams } from "../validators/schema/user/ResetPasswordUserValidator";

// Importando controllers dos usuários
import { CreateUserRequestController } from "../controllers/user/CreateUserRequestController";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { SocialUserLoginController } from "../controllers/user/SocialUserLoginController";
import { AuthUserController } from "../controllers/user/AuthUserController";
import { ProfileUserController } from "../controllers/user/ProfileUserController";
import { RequestUserResetPasswordController } from "../controllers/user/RequestUserResetPasswordController";
import { ResetPasswordUserController } from "../controllers/user/ResetPasswordUserController";

// importando passport para o login com google ou facebook
import passport from "passport";

// criando variavel para instânciar o Router
const routes = Router();

// Instânciando controllers de usuários
const createUserRequestController = new CreateUserRequestController();
const createUserController = new CreateUserController();
const socialUserLoginController = new SocialUserLoginController();
const authUserController = new AuthUserController();
const profileUserController = new ProfileUserController();
const requestUserResetPasswordController =
  new RequestUserResetPasswordController();
const resetPasswordUserController = new ResetPasswordUserController();

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
routes.post(
  "/forgot-password",
  ensureJoi(RequestUserResetPasswordValidator, "body"),
  requestUserResetPasswordController.handle
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
routes.get("/profile", ensureAuthenticated, profileUserController.handle);

// put
routes.put(
  "/reset-password/:token",
  ensureJoi(ResetPasswordUserValidatorParams, "params"),
  ensureJoi(ResetPasswordUserValidator, "body"),
  resetPasswordUserController.handle
);

// exportando routes com as
export { routes as userRoutes };
