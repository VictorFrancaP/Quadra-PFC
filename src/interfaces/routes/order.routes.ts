// Importando Router do express
import { Router } from "express";

// Importando middlewares
import { ensureRole } from "../middlewares/ensureRole";
import { ensureJoi } from "../middlewares/ensureJoi";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

// Importando validators schema
import { CreateOrderUserValidator } from "../validators/schema/order/CreateOrderUserValidator";
import { UpdateOrderUserValidator } from "../validators/schema/order/UpdateOrderUserValidator";

// Importando controllers
import { CreateOrderUserController } from "../controllers/order/CreateOrderUserController";
import { FindOrdersController } from "../controllers/order/FindOrdersController";
import { UpdateUserOrderController } from "../controllers/order/UpdateUserOrderController";

// criando variavel para instânciar o Router do express
const routes = Router();

// criando instância das controllers
const createOrderUserController = new CreateOrderUserController();
const findOrdersController = new FindOrdersController();
const updateUserOrderController = new UpdateUserOrderController();

// criando rotas

// post
routes.post(
  "/create",
  ensureAuthenticated,
  ensureJoi(CreateOrderUserValidator),
  createOrderUserController.handle
);

// get
routes.get(
  "/findAll",
  ensureAuthenticated,
  ensureRole("ADMIN"),
  findOrdersController.handle
);

// put
routes.put(
  "/update",
  ensureAuthenticated,
  ensureJoi(UpdateOrderUserValidator, "body"),
  updateUserOrderController.handle
);

// exportando rotas com as
export { routes as orderRoutes };
