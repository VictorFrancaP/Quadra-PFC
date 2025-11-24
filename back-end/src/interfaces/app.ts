// Importando express
import express from "express";

// Importando cors diretamente (para garantir que funcione sem depender de arquivo externo agora)
import cors from "cors";

// Importando cookieParser para utilização de httpOnly
import cookieParser from "cookie-parser";

// Importando swaggeruiexpress para a documentação da api
import swaggerUi from "swagger-ui-express";

// Importando arquivo do swagger.json para utilização da rota de documentação
import swaggerDocs from "../../swagger.json";

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
const FRONT_PROD = "https://quadra-pfc.vercel.app";

// configurando array com os endereços liberados para acesso do cors
// Garante que não tenha strings vazias ou undefined
const allowedOrigins = [FRONT_DEV, FRONT_PROD].filter(Boolean) as string[];

// --- CORREÇÃO 1: CORS COMO PRIMEIRO MIDDLEWARE ---
// Isso evita o erro 404 em requisições OPTIONS (Preflight)
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Permite cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// --- CORREÇÃO 2: LOGGER PARA DEPURAÇÃO ---
// Isso vai mostrar no log do Render toda vez que alguém tentar acessar
app.use((req, res, next) => {
  console.log(`[LOG SERVER] ${req.method} ${req.originalUrl}`);
  next();
});

// --- CORREÇÃO 3: ROTA DE PING (HEALTH CHECK) ---
app.get("/ping", (req, res) => {
  return res.status(200).json({ status: "online", date: new Date() });
});

// instãnciando novo server do socket.io
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// rawRouter para a utilização do mercagopago
// O webhook precisa vir antes do express.json()
const rawRouter = express.Router();
rawRouter.use(express.raw({ type: "*/*" }), ensurePayment);
rawRouter.use(webHookRoutes);

// criando middlewares para utilização de dados do tipo json
app.use(cookieParser());
app.use(express.json());

// Se você quiser usar o corsConfig externo depois, pode descomentar,
// mas deixe o cors explicito acima por enquanto para garantir.
// app.use(corsConfig);

// utilizando rota de documentação da api
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// utilizando passport
app.use(passport.initialize());
passportConfig();

// utilizando rotas
// IMPORTANTE: Verifique se refreshTokenRoutes está exportando router.post('/')
app.use("/auth/user", userRoutes);
app.use("/auth/refresh", refreshTokenRoutes);
app.use("/auth/order", orderRoutes);
app.use("/auth/soccer", soccerRoutes);
app.use("/auth/rating", ratingRoutes);
app.use("/auth/reservation", reservationRoutes);
app.use("/auth/support", supportRoutes);

// Rota do Webhook (Raiz)
app.use("/", rawRouter);

// utilizando middleware de error (ultimo a ser executado)
app.use(errorHandler);

// exportando servidores
export { httpServer, io };
