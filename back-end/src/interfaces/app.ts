// Importando express
import express from "express";

// Importando cookieParser para utilização de httpOnly
import cookieParser from "cookie-parser";

// Importando configuração do cors
import { corsConfig } from "../shared/providers/cors/corsConfig";

// Importando rotas
import { userRoutes } from "./routes/user-routes";
import { refreshTokenRoutes } from "./routes/refresh-token.routes";
import { orderRoutes } from "./routes/order.routes";
import { soccerRoutes } from "./routes/soccer.routes";

// Importando middleware de error
import { errorHandler } from "./middlewares/errorHandler";

// Importando passport para login com outras plataformas
import passport from "passport";

// Importando configuração do passport.use
import { passportConfig } from "../shared/providers/passport/passportGoogleConfig";

// exportando e criando variavel para o express
export const app = express();

// criando middlewares para utilização de dados do tipo json
app.use(express.json());
app.use(corsConfig);
app.use(cookieParser());

// utilizando rotas
app.use("/auth/user", userRoutes);
app.use("/auth", refreshTokenRoutes);
app.use("/auth/order", orderRoutes);
app.use("/auth/soccer", soccerRoutes);

// utilizando passport
app.use(passport.initialize());
passportConfig();

// utilizando middleware de error (ultimo a ser executado)
app.use(errorHandler);
