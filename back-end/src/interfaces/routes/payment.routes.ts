// Importando Router do express
import { Router } from "express";

// Importando controllers
import { WebHookController } from "../controllers/payment/WebHookController";

// criando variavel para instânciar o Router do express
const routes = Router();

// instânciando controllers
const webHookController = new WebHookController();

// rotas

// post
routes.post("/webhook/mercadopago", webHookController.handle);

// exportando rotas com as
export { routes as webHookRoutes };
