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
import { RequestUserEmailValidator } from "../validators/schema/user/RequestUserEmailValidator";
import { ResetPasswordUserValidator } from "../validators/schema/user/ResetPasswordUserValidator";
import { ResetPasswordUserValidatorParams } from "../validators/schema/user/ResetPasswordUserValidator";
import { UpdateUserProfileValidator } from "../validators/schema/user/UpdateUserProfileValidator";
import { RequestParamsValidator } from "../validators/schema/RequestParamsValidator";
import { UpdateUserRoleValidator } from "../validators/schema/user/UpdateUserRoleValidator";
import { Verify2FAUserValidator } from "../validators/schema/user/Verify2FAUserValidator";

// Importando controllers dos usuários
import { CreateUserRequestController } from "../controllers/user/CreateUserRequestController";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { SocialUserLoginController } from "../controllers/user/SocialUserLoginController";
import { AuthUserController } from "../controllers/user/AuthUserController";
import { ProfileUserController } from "../controllers/user/ProfileUserController";
import { RequestUserResetPasswordController } from "../controllers/user/RequestUserResetPasswordController";
import { ResetPasswordUserController } from "../controllers/user/ResetPasswordUserController";
import { FindUsersController } from "../controllers/user/FindUsersController";
import { DeleteUserController } from "../controllers/user/DeleteUserController";
import { FindUserController } from "../controllers/user/FindUserController";
import { UpdateUserProfileController } from "../controllers/user/UpdateUserProfileController";
import { UpdateUserRoleController } from "../controllers/user/UpdateUserRoleController";
import { Setup2FAUserController } from "../controllers/user/Setup2FAUserController";
import { Verify2FAUserController } from "../controllers/user/Verify2FAUserController";
import { LogoutUserController } from "../controllers/user/LogoutUserController";

// importando passport para o login com google
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
const findUsersController = new FindUsersController();
const deleteUserController = new DeleteUserController();
const findUserController = new FindUserController();
const updateUserProfileController = new UpdateUserProfileController();
const updateUserRoleController = new UpdateUserRoleController();
const setup2FAUserController = new Setup2FAUserController();
const verify2FAUserController = new Verify2FAUserController();
const logoutUserController = new LogoutUserController();

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
  ensureJoi(RequestUserEmailValidator, "body"),
  requestUserResetPasswordController.handle
);
routes.post("/setup-2fa", ensureAuthenticated, setup2FAUserController.handle);
routes.post("/verify-2fa/:userId", verify2FAUserController.handle);
routes.post("/logout", ensureAuthenticated, logoutUserController.handle);
routes.post(
  "/find",
  ensureAuthenticated,
  ensureRole("ADMIN"),
  ensureJoi(RequestUserEmailValidator, "body"),
  findUserController.handle
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
routes.get(
  "/all",
  ensureAuthenticated,
  ensureRole("ADMIN"),
  findUsersController.handle
);

// put
routes.put(
  "/reset-password/:token",
  ensureJoi(ResetPasswordUserValidatorParams, "params"),
  ensureJoi(ResetPasswordUserValidator, "body"),
  resetPasswordUserController.handle
);
routes.put(
  "/update",
  ensureAuthenticated,
  ensureJoi(UpdateUserProfileValidator, "body"),
  updateUserProfileController.handle
);
routes.put(
  "/updateRole/:id",
  ensureAuthenticated,
  ensureRole("ADMIN"),
  ensureJoi(RequestParamsValidator, "params"),
  ensureJoi(UpdateUserRoleValidator, "body"),
  updateUserRoleController.handle
);

// delete
routes.delete("/delete", ensureAuthenticated, deleteUserController.handle);

// exportando rota
export { routes as userRoutes };
