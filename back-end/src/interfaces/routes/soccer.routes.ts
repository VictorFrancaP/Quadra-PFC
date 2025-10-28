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
import { FindNearbySoccerValidator } from "../validators/schema/soccer/FindNearbySoccerValidator";

// Importando controllers
import { CreateOwnerSoccerController } from "../controllers/soccer/CreateOwnerSoccerController";
import { FindSoccersController } from "../controllers/soccer/FindSoccersController";
import { DeleteSoccerByAdminController } from "../controllers/soccer/DeleteSoccerByAdminController";
import { DeleteSoccerByOwnerController } from "../controllers/soccer/DeleteSoccerByOwnerController";
import { UpdateSoccerOwnerController } from "../controllers/soccer/UpdateSoccerOwnerController";
import { FindNearbySoccerController } from "../controllers/soccer/FindNearbySoccerController";
import { UploadSoccerImagesController } from "../controllers/soccer/UploadSoccerImagesController";
import { FindSoccerController } from "../controllers/soccer/FindSoccerController";
import { FindSoccerOwnerController } from "../controllers/soccer/FindSoccerOwnerController";

// Importando configuração do cloudinary para imagens
import { updateSoccerImages } from "../../shared/providers/cloudinary/cloudinaryConfig";

// instância do Router
const routes = Router();

// instâncias das controllers
const createOwnerSoccerController = new CreateOwnerSoccerController();
const findSoccersController = new FindSoccersController();
const deleteSoccerByAdminController = new DeleteSoccerByAdminController();
const deleteSoccerByOwnerController = new DeleteSoccerByOwnerController();
const updateSoccerOwnerController = new UpdateSoccerOwnerController();
const findNearbySoccerController = new FindNearbySoccerController();
const uploadSoccerImagesController = new UploadSoccerImagesController();
const findSoccerController = new FindSoccerController();
const findSoccerOwnerController = new FindSoccerOwnerController();

// post
routes.post(
  "/create",
  ensureAuthenticated,
  ensureRole("ADMIN", "OWNER"),
  ensureHour(CreateOwnerSoccerValidator),
  createOwnerSoccerController.handle
);
routes.post(
  "/nearby",
  ensureAuthenticated,
  ensureJoi(FindNearbySoccerValidator, "body"),
  findNearbySoccerController.handle
);
routes.post(
  "/images/:id",
  ensureAuthenticated,
  ensureRole("ADMIN", "OWNER"),
  ensureJoi(RequestParamsValidator, "params"),
  updateSoccerImages.array("images", 5),
  uploadSoccerImagesController.handle
);

// get
routes.get("/findAll", ensureAuthenticated, findSoccersController.handle);
routes.get(
  "/find",
  ensureAuthenticated,
  ensureRole("OWNER"),
  findSoccerOwnerController.handle
);
routes.get(
  "/:id",
  ensureAuthenticated,
  ensureJoi(RequestParamsValidator, "params"),
  findSoccerController.handle
);

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
