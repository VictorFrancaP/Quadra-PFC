// Importando express
import express from "express";

// Importando rotas
import { userRoutes } from "./routes/user.routes";

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

// utilizando rotas
app.use("/auth", userRoutes);

// utilizando passport
app.use(passport.initialize());
passportConfig();

// utilizando middleware de error (ultimo a ser executado)
app.use(errorHandler);
