// Importando express
import express from "express";

// Importando cookieParser para utilização de httpOnly
import cookieParser from "cookie-parser";

// Importando swaggeruiexpress para a documentação da api
import swaggerUi from "swagger-ui-express";

// Importando arquivo do swagger.json para utilização da rota de documentação
import swaggerDocs from "../../swagger.json";

// Importando configuração do cors
import { corsConfig } from "../shared/providers/cors/corsConfig";

// Importando rotas
import { userRoutes } from "./routes/user-routes";
import { refreshTokenRoutes } from "./routes/refresh-token.routes";
import { orderRoutes } from "./routes/order.routes";
import { soccerRoutes } from "./routes/soccer.routes";
import { ratingRoutes } from "./routes/rating.routes";
import { reservationRoutes } from "./routes/reservation.routes";
import { webHookRoutes } from "./routes/payment.routes";
import { supportRoutes } from "./routes/support.routes";

// Importando middleware de error
import { errorHandler } from "./middlewares/errorHandler";

// Importando passport para login com outras plataformas
import passport from "passport";

// Importando configuração do passport.use
import { passportConfig } from "../shared/providers/passport/passportGoogleConfig";

// Importando http do node para iniciar um servidor
import http from "http";

// Importando Server do socket.io para instânciar um novo server
import { Server } from "socket.io";

// Importando middleware para o webhook do mercadopago
import { ensurePayment } from "./middlewares/ensurePayment";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// exportando e criando variavel para o express
const app = express();

// criando novo servidor em cima do app express
const httpServer = http.createServer(app);

// carregando variaveis de ambiente com as urls
const FRONT_DEV = process.env.FRONT_HOST;
const FRONT_PROD = process.env.FRONT_HOST_PROD;

// configurando array com os endereços liberados para acesso do cors
const allowedOrigins = [FRONT_DEV, FRONT_PROD].filter(Boolean) as string[];

// instãnciando novo server do socket.io
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// rawRouter para a utilização do mercagopago
const rawRouter = express.Router();
rawRouter.use(express.raw({ type: "*/*" }), ensurePayment);
rawRouter.use(webHookRoutes);

// criando middlewares para utilização de dados do tipo json
app.use(cookieParser());
app.use(express.json());
app.use(corsConfig);

// utilizando rota de documentação da api
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// utilizando passport
app.use(passport.initialize());
passportConfig();

// utilizando rotas
app.use("/auth/user", userRoutes);
app.use("/auth/refresh", refreshTokenRoutes);
app.use("/auth/order", orderRoutes);
app.use("/auth/soccer", soccerRoutes);
app.use("/auth/rating", ratingRoutes);
app.use("/auth/reservation", reservationRoutes);
app.use("/auth/support", supportRoutes);
app.use("/", rawRouter);

// utilizando middleware de error (ultimo a ser executado)
app.use(errorHandler);

// exportando servidores
export { httpServer, io };
